import { Logger } from './Logger'
import { TagLoader, TagPersistor } from './Tag'
import {UserLoader, UserPersistor} from './User'

export * from './Logger'

export interface Deps {
  logger: Logger
  tagPersistor: TagPersistor
  tagLoader: TagLoader
  userPersistor: UserPersistor
  userLoader: UserLoader
}

export interface Pagination {
  limit: number
  offset: number
}

export enum SortingDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
