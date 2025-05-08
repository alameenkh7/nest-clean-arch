import { Module } from '@nestjs/common'
import { CoreAdapterModule } from 'src/coreadapter/coreadapter.module'
import { HealthController } from './health.controller'
import { InfoController } from './info.controller'

@Module({
  imports: [CoreAdapterModule],
  controllers: [HealthController, InfoController],
  providers: []
})
export class HttpModule {}
