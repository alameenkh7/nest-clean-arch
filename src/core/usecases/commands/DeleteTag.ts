import { Deps } from '../../entitygateway'

export const name = 'delete-tag'

export interface Input {
  tagId: string
}

export interface Output {
  message: string
}

export const makeUC =
  ({ tagPersistor }: Deps) =>
  async ({ tagId }: Input): Promise<Output> => {
    tagPersistor.deleteById(tagId)
    return {
      message: `Removed tag ${tagId}`,
    }
  }
