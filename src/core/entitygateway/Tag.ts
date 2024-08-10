import { Tag } from '../entities/Tag'

export interface TagPersistor {
  persist: (tag: Tag) => Promise<void>
  deleteById: (id: string) => Promise<void>
}

export interface TagLoader {
  loadById: (id: string) => Promise<Tag | null>
  loadByName: (name: string) => Promise<Tag | null>
  loadAll: () => Promise<Tag[]>
}
