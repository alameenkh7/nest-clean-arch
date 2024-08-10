import { Global, Module } from '@nestjs/common'
import { loggerFactory } from './logger.service'
import { NormalizedConfModule } from '../../config/NormalizedConfModule'

@Global()
@Module({
  imports: [NormalizedConfModule],
  providers: [loggerFactory],
  exports: [loggerFactory],
})
export class LoggerModule {}
