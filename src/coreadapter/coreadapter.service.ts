import { FactoryProvider } from '@nestjs/common'
import { initUseCases, UseCases } from 'src/core/usecases'
import { Logger } from '../core/entitygateway'
import { CoreS, LoggerS } from '../tokens'
import { FirebaseService } from '../modules/firebase/core/firebase.service'
import { Tag } from '../core/entities/Tag'

export const coreAdapterService: FactoryProvider = {
  provide: CoreS,
  useFactory: (logger: Logger): UseCases => {
    const firebaseService = new FirebaseService<Tag>();
    return initUseCases({
      tagPersistor: {
        persist: async (tag: Tag): Promise<void> => {
          const { id, ...tagData } = tag;
          await firebaseService.create(tagData);
        },
        deleteById: async (id: string): Promise<void> => {
          await firebaseService.delete(id);
        }
      },
      tagLoader: {
        loadAll: async () => {
          const result = await firebaseService.findWithPagination({ page: 1, limit: 1000 });
          return result.items;
        },
        loadById: async (tagId: string) => {
          return await firebaseService.findById(tagId);
        },
        loadByName: async (name: string): Promise<Tag | null> => {
          const result = await firebaseService.findWithPagination({ page: 1, limit: 1000 });
          return result.items.find((tag: Tag) => tag.name.toLowerCase().includes(name.toLowerCase())) || null;
        }
      },
      logger,
    });
  },
  inject: [LoggerS]
}
