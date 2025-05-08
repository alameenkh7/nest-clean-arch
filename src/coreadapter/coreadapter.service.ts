import { FactoryProvider } from '@nestjs/common'
import { initUseCases, UseCases } from 'src/core/usecases'
import { Logger } from '../core/entitygateway'
import { CoreS, LoggerS } from '../tokens'
import { FirebaseService } from '../services/firebase.service'

export const coreAdapterService: FactoryProvider = {
  provide: CoreS,
  useFactory: (logger: Logger, firebaseService: FirebaseService): UseCases =>
    initUseCases({
      tagPersistor: {
        persist: async (tag) => {
          await firebaseService.create('tags', tag);
        },
        deleteById: async (tagId: string) => {
          await firebaseService.delete('tags', tagId);
        }
      },
      tagLoader: {
        loadAll: async () => {
          return await firebaseService.findAll('tags');
        },
        loadById: async (tagId: string) => {
          return await firebaseService.findById('tags', tagId);
        },
        loadByName: async (name: string) => {
          const tags = await firebaseService.findAll('tags');
          return tags.find(tag => tag.name.toLowerCase().includes(name.toLowerCase())) || null;
        }
      },
      logger,
    }),
  inject: [LoggerS, FirebaseService],
}
