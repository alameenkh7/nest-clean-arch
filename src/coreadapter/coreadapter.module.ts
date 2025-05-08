import { Module } from '@nestjs/common'
import { coreAdapterService } from './coreadapter.service'
import { FirebaseService } from '../modules/firebase/core/firebase.service'
import { LoggerModule } from '../infrastructure/Logger/logger.module'

@Module({
  imports: [LoggerModule],
  providers: [coreAdapterService],
  exports: [coreAdapterService],
})
export class CoreAdapterModule {}
