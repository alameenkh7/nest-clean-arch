import { Logger } from './Logger'
import { TagLoader, TagPersistor } from './Tag'

export * from './Logger'

export interface Deps {
  logger: Logger
  tagPersistor: TagPersistor
  tagLoader: TagLoader
}

export interface Pagination {
  limit: number
  offset: number
}

export enum SortingDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
