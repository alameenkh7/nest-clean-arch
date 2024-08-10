import { NestFactory } from '@nestjs/core'
import { Configuration } from './config/NormalizedConfModule'
import { makeLogger } from './infrastructure/Logger/logger.service'
import { AppModule } from './main/app.module'
import cookieParser from 'cookie-parser'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import compression from 'compression'
import { ConfigS } from './tokens'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

Error.stackTraceLimit = 200 //Please tell with team before change that value

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const config: Configuration = app.get(ConfigS)

  app.use(cookieParser())
  app.useLogger(makeLogger(config))
  app.use(compression())

  await app.listen(config.port)
}
bootstrap()
