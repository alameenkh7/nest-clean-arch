import { Module } from '@nestjs/common'
import { coreAdapterService } from './coreadapter.service'
import { FirebaseService } from '../services/firebase.service'
import { LoggerModule } from '../infrastructure/Logger/logger.module'

@Module({
  imports: [LoggerModule],
  providers: [coreAdapterService, FirebaseService],
  exports: [coreAdapterService],
})
export class CoreAdapterModule {}
