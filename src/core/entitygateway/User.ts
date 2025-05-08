import { User } from "../entities/User";

export interface UserPersistor {
    persist: (tag: User) => Promise<void>
    deleteById: (id: string) => Promise<void>
  }
  
  export interface UserLoader {
    loadById: (id: string) => Promise<User | null>
    loadByName: (name: string) => Promise<User | null>
    loadAll: () => Promise<User[]>
  }
  