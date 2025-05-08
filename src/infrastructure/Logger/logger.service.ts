import { FactoryProvider, LoggerService } from '@nestjs/common'
import { ConfigS, LoggerS } from '../../tokens'
import {
  format,
  createLogger,
  Logger as WinstonLogger,
  transports as winstonTransports,
  config as winstonConfig,
} from 'winston'
import { LoggingWinston } from '@google-cloud/logging-winston'

import { Configuration } from 'src/config/NormalizedConfModule'
import { contextFormatter } from './contextFormatter'
import { levelZipFormatter } from './levelZipFormatter'

export type Logger = LoggerService & {
  critical: (message: any, ...optionsParams: any[]) => any
  emergency: (message: any, ...optionsParams: any[]) => any
  debug: (message: any, ...optionsParams: any[]) => any
  verbose: (message: any, ...optionsParams: any[]) => any
  rawLogger: WinstonLogger
}

const prettyConsoleTransport = new winstonTransports.Console({
  level: 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    contextFormatter({ removeContextFromMeta: true }),
    levelZipFormatter({ size: 3 }),
    format.colorize({
      level: true,
      colors: {
        debug: 'cyan',
        info: 'green',
        notice: 'white',
        warning: 'yellow',
        error: 'red',
        crit: 'bgRed',
        emerg: 'bgMagenta',
      },
    }),

    format.simple()
  ),
})

export function makeLogger(conf: Configuration): Logger {
  let logNamePrefix = ''

  if (conf.isDevelopment) {
    logNamePrefix = 'dev-'
  }

  if (conf.isStaging) {
    logNamePrefix = 'staging-'
  }

  const logName = `${logNamePrefix}${conf.appName}`

  const googleTransport = new LoggingWinston({
    keyFilename: conf.googleKeyFilePath,
    projectId: '',
    logName,
    levels: winstonConfig.syslog.levels, // Before change this read the winston and google-stackdrive-transport docs
    serviceContext: {
      service: conf.appName,
      version: conf.appVersion,
    },
  })

  const transports = []
  if (conf.isDevelopment) {
    transports.push(prettyConsoleTransport)
  } else {
    transports.push(prettyConsoleTransport)
    transports.push(googleTransport)
  }

  const logger = createLogger({
    levels: winstonConfig.syslog.levels, // Before change this read the winston and google-stackdrive-transport docs
    level: 'debug',
    transports: transports,
  })

  logger.on('error', err => {
    console.log('Logger error:')
    console.log(err)
  })

  logger.on('finish', () => {
    console.log('all flushed')
  })

  return {
    rawLogger: logger,
    debug: (message: any, context: any) => {
      if ('object' === typeof message) {
        const { message: msg, ...meta } = message
        return logger.debug(msg as string, { context, ...meta })
      }

      return logger.debug(message, { context })
    },
    verbose: (message: any, context: any) => {
      if ('object' === typeof message) {
        const { message: msg, ...meta } = message
        return logger.info(msg as string, { context, ...meta })
      }
      return logger.info(message, { context })
    },
    log: (message: any, context: any) => {
      if ('object' === typeof message) {
        const { message: msg, ...meta } = message
        return logger.info(msg as string, { context, ...meta })
      }
      return logger.notice(message, { context })
    },
    warn: (message: any, context: any) => {
      if ('object' === typeof message) {
        const { message: msg, ...meta } = message
        return logger.warning(msg as string, { context, ...meta })
      }
      return logger.warning(message, { context })
    },
    error: (message: any, trace?: string, context?: string) => {
      if (message instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message: msg, name, stack, ...meta } = message

        return logger.error(msg, {
          context,
          stack: [trace || message.stack],
          ...meta,
        })
      }

      if ('object' === typeof message) {
        const { message: msg, ...meta } = message

        return logger.error(msg as string, {
          context,
          stack: [trace],
          ...meta,
        })
      }

      // const ftrace = !trace
      //   ? []
      //   : 'string' !== typeof trace
      //   ? [trace]
      //   : trace.split('\n')

      return logger.error(message, { context, stack: [trace] })
    },
    critical: (message: any, context: any) => {
      if ('object' === typeof message) {
        const { message: msg, ...meta } = message
        return logger.crit(msg as string, { context, ...meta })
      }
      return logger.crit(message, { context })
    },
    emergency: (message: any, context: any) => {
      if ('object' === typeof message) {
        const { message: msg, ...meta } = message
        return logger.emerg(msg as string, { context, ...meta })
      }
      return logger.emerg(message, { context })
    },
  }
}

export const loggerFactory: FactoryProvider = {
  provide: LoggerS,
  useFactory: makeLogger,
  inject: [ConfigS],
}
