import { Module } from '@nestjs/common'
import { factory } from './inmemorystorage.service'

@Module({
  providers: [factory],

  exports: [factory],
})
export class InMemoryStorageModule {}
