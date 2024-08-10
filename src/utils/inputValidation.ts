import * as t from 'io-ts'
import { last } from 'lodash'

export const validationErrorsToJsonPathErrors = (
  errors: t.Errors
): JsonPathError[] =>
  errors.map(error => {
    const lastContextEntry = last(error.context)
    const typeName = lastContextEntry && lastContextEntry.type.name
    return {
      jsonPath: getContextJsonPath(error.context),
      message: `${typeName ? `type ${typeName}: ` : ''}${
        error.message || 'is mandatory'
      }`,
    }
  })

const getContextJsonPath = (context: t.Context): string =>
  `${context
    .map(({ key }, idx) =>
      idx === 0 ? '$' : /^\d+$/.test(key) ? `[${key}]` : `.${key}`
    )
    .join('')}`

export interface InputValidationError extends Error {
  type: 'INPUT_VALIDATION_ERROR'
  errors: JsonPathError[]
}

export interface JsonPathError {
  jsonPath: string
  message: string
}
