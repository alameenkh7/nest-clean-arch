import { Controller, Get, Inject } from '@nestjs/common'
import { Configuration } from '../../config/NormalizedConfModule'
import { ConfigS } from '../../tokens'

@Controller('api/info')
export class InfoController {
  constructor(@Inject(ConfigS) private readonly config: Configuration) {}

  @Get('')
  async info() {
    return {
      nodeEnv: this.config.nodeEnv,
      environment: this.config.environment,
      version: this.config.appVersion,
      uptime: process.uptime(),
    }
  }
}
