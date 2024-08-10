import { Module } from '@nestjs/common'
import { coreAdapterService } from './coreadapter.service'
import { InMemoryStorageModule } from '../infrastructure/InMemoryStorage/inmemorystorage.module'

@Module({
  imports: [InMemoryStorageModule],
  providers: [coreAdapterService],
  exports: [coreAdapterService],
})
export class CoreAdapterModule {}
