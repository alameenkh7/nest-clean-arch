import { Deps } from '../entitygateway'
import * as AddUser from './commands/AddUser'
import * as DeleteUser from './commands/DeleteUser'
import * as AddTag from './commands/AddTag'
import * as UpdateTag from './commands/UpdateTag'
import * as DeleteTag from './commands/DeleteTag'

import { logMessageWrapper, wrapUC } from './wrappers'

const defaultWrappers = [logMessageWrapper]

export function initUseCases(deps: Deps) {
  // Commands

  const addUser = wrapUC(
    deps,
    AddUser.makeUC(deps),
    AddUser.name,
    ...defaultWrappers
  )

const deleteUser = wrapUC(
  deps,
  DeleteUser.makeUC(deps),
  DeleteUser.name,
  ...defaultWrappers
)


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
      addUser,
      deleteUser,
      addTag,
      updateTag,
      deleteTag,
    },
  }
}

export type UseCases = ReturnType<typeof initUseCases>
