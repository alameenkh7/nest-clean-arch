import { Deps } from '../../entitygateway'
import { v4 as UUID } from 'uuid'
import { Tag } from '../../entities/Tag'
import { isValidHexColor } from '../../../utils/functions'

export const name = 'add-tag'

export type Output = {
  message: string
  id: string
}

export interface Input {
  name: string
  description: string
  foreground: string
  background: string
}

export const makeUC =
  ({ tagPersistor, tagLoader }: Deps) =>
  async ({
    name,
    description,
    foreground,
    background,
  }: Input): Promise<Output> => {
    const tag = await tagLoader.loadByName(name)

    if (tag) {
      throw new Error('Tag already exists')
    }

    if (!isValidHexColor(foreground)) {
      throw new Error(
        'Invalid foreground color. Please provide a valid hexadecimal color value.'
      )
    }

    if (!isValidHexColor(background)) {
      throw new Error(
        'Invalid background color. Please provide a valid hexadecimal color value.'
      )
    }
    const now = new Date()

    const tagToPersist: Tag = {
      id: UUID(),
      name,
      description,
      foreground,
      background,
      createdAt: now,
      updatedAt: now,
    }

    await tagPersistor.persist(tagToPersist)

    return {
      message: `Tag ${tagToPersist.name} created`,
      id: tagToPersist.id,
    }
  }
