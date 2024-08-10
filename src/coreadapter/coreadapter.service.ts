import { FactoryProvider } from '@nestjs/common'
import { initUseCases, UseCases } from 'src/core/usecases'
import { Logger } from '../core/entitygateway'
import { CoreS, LoggerS, PersistenceS } from '../tokens'
import { InMemoryPersistence } from '../infrastructure/InMemoryStorage/inmemorystorage.service'

export const coreAdapterService: FactoryProvider = {
  provide: CoreS,
  useFactory: (logger: Logger, mem: InMemoryPersistence): UseCases =>
    initUseCases({
      ...mem,
      logger,
    }),
  inject: [LoggerS, PersistenceS],
}
