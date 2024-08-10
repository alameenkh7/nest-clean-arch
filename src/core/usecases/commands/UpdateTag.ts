import { Deps } from '../../entitygateway'
import { HttpException } from '@nestjs/common'
import { Tag } from '../../entities/Tag'
import { isValidHexColor } from '../../../utils/functions'

export const name = 'update-tag'

export type Output = {
  message: string
  id: string
}

export interface Input {
  id: string
  name?: string
  description?: string
  foreground?: string
  background?: string
}

export const makeUC =
  ({ tagPersistor, tagLoader }: Deps) =>
  async ({
    id,
    name,
    description,
    foreground,
    background,
  }: Input): Promise<Output> => {
    const tag = await tagLoader.loadById(id)

    if (!tag) {
      throw new Error('Tag not found')
    }

    if (!name) {
      throw new Error('Tag name is required')
    }

    const existingTagByName = await tagLoader.loadByName(name)

    if (existingTagByName && existingTagByName.id !== id) {
      throw new Error('Tag name already exists')
    }

    if (foreground && !isValidHexColor(foreground)) {
      throw new Error(
        'Invalid foreground color. Please provide a valid hexadecimal color value.'
      )
    }

    if (background && !isValidHexColor(background)) {
      throw new Error(
        'Invalid background color. Please provide a valid hexadecimal color value.'
      )
    }

    const updatedTag: Tag = {
      id: tag.id,
      name: name ?? tag.name,
      description: description ?? tag.description,
      foreground: foreground ?? tag.foreground,
      background: background ?? tag.background,
      createdAt: tag.createdAt,
      updatedAt: new Date(),
    }

    await tagPersistor.persist(updatedTag)

    return {
      message: `Tag ${updatedTag.name} updated`,
      id: tag.id,
    }
  }
