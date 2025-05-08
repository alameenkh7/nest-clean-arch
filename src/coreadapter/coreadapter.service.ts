import { FactoryProvider } from '@nestjs/common';
import { initUseCases, UseCases } from '../core/usecases';
import { Logger } from '../core/entitygateway';
import { CoreS, LoggerS, PersistenceS } from '../tokens';
import { InMemoryPersistence } from '../infrastructure/InMemoryStorage/inmemorystorage.service';

export const coreAdapterService: FactoryProvider<UseCases> = {
  provide: CoreS,
  useFactory: (logger: Logger, mem: InMemoryPersistence): UseCases =>
    initUseCases({
      ...mem, // Spread properties of mem (assuming it includes all required properties)
      logger,
      tagPersistor: mem.tagPersistor,  // Add missing properties if needed
      tagLoader: mem.tagLoader,        // Add missing properties if needed
    }),
  inject: [LoggerS, PersistenceS],
};