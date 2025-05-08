import { Module } from '@nestjs/common'
import { CoreAdapterModule } from 'src/coreadapter/coreadapter.module'
// import { FirebaseService } from '../../services/firebase.service'
import { HealthController } from './health.controller'
import { InfoController } from './info.controller'
import { FirebaseService } from '../../services/firebase.service'

@Module({
  imports: [CoreAdapterModule],
  controllers: [HealthController, InfoController],
  providers: [FirebaseService]
})
export class HttpModule {}
