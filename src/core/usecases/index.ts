import { Deps } from '../entitygateway'

import * as AddTag from './commands/AddTag'
import * as UpdateTag from './commands/UpdateTag'
import * as DeleteTag from './commands/DeleteTag'

import { logMessageWrapper, wrapUC } from './wrappers'

const defaultWrappers = [logMessageWrapper]

export function initUseCases(deps: Deps) {
  // Commands

  const addTag = wrapUC(
    deps,
    AddTag.makeUC(deps),
    AddTag.name,
    ...defaultWrappers
  )

  const updateTag = wrapUC(
    deps,
    UpdateTag.makeUC(deps),
    UpdateTag.name,
    ...defaultWrappers
  )

  const deleteTag = wrapUC(
    deps,
    DeleteTag.makeUC(deps),
    DeleteTag.name,
    ...defaultWrappers
  )

  // Queries

  return {
    queries: {},
    commands: {
      addTag,
      updateTag,
      deleteTag,
    },
    tagLoader: deps.tagLoader,
  }
}

export type UseCases = ReturnType<typeof initUseCases>
