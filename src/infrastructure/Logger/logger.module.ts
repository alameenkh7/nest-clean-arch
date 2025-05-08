import { Global, Module } from '@nestjs/common'
import { loggerFactory } from './logger.service'
import { NormalizedConfModule } from '../../config/NormalizedConfModule'
import { ConfigS, LoggerS } from '../../tokens'

@Global()
@Module({
  imports: [NormalizedConfModule],
  providers: [{
    provide: LoggerS,
    useFactory: (conf) => loggerFactory.useFactory(conf),
    inject: [ConfigS]
  }],
  exports: [LoggerS],
})
export class LoggerModule {}
