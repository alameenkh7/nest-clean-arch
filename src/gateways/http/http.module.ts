import { Module } from '@nestjs/common'
import { CoreAdapterModule } from 'src/coreadapter/coreadapter.module'
import { InMemoryStorageModule } from '../../infrastructure/InMemoryStorage/inmemorystorage.module'
import { HealthController } from './health.controller'
import { InfoController } from './info.controller'

@Module({
  imports: [CoreAdapterModule, InMemoryStorageModule],
  controllers: [HealthController, InfoController],
  
})
export class HttpModule {}
