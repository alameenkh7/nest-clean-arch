import { FactoryProvider } from '@nestjs/common'
import fs from 'fs'
import { Deps } from 'src/core/entitygateway'
import { Configuration } from '../../config/NormalizedConfModule'
import { ConfigS, LoggerS, PersistenceS } from '../../tokens'
import { Logger } from '../Logger/logger.service'
import { replacer, revive } from './serdes'
import { Tag } from '../../core/entities'

export type InMemoryPersistence = Pick<
  Deps,
  'tagPersistor' | 'tagLoader'
>

type PersistenceObj = {
  files: File[]
  tags: Tag[]
}

export const factory: FactoryProvider = {
  provide: PersistenceS,
  useFactory: (conf: Configuration, logger: Logger): InMemoryPersistence => {
    const filePath = conf.inMemoryStorageFilePath
    let persistenceObj: PersistenceObj = { files: [], tags: [] }
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      persistenceObj = revive(JSON.parse(fileContent)) as PersistenceObj
    } catch (error) {
      logger.debug(error)
    }

    const save = () => {
      const text = JSON.stringify(persistenceObj, replacer, 2)
      try {
        fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
      } catch (error) {
        logger.debug(error)
      }
    }

    return {
      tagPersistor: {
        persist: async (tag: Tag) => {
          const others = persistenceObj.tags.filter(o => o.id !== tag.id)
          persistenceObj.tags = [...others, tag]
          save()
        },
        deleteById: async (tagId: string) => {
          persistenceObj.tags = persistenceObj.tags.filter(
            tag => tag.id !== tagId
          )
          save()
        },
      },
      tagLoader: {
        loadById: async (id: string) => {
          return persistenceObj.tags?.find(tag => tag.id === id) || null
        },
        loadByName: async (partialName: string) => {
          return (
            persistenceObj.tags?.find(tag => tag.name.includes(partialName)) ||
            null
          )
        },
        loadAll: async () => {
          return persistenceObj.tags
        },
      },
    }
  },
  inject: [ConfigS, LoggerS],
}
