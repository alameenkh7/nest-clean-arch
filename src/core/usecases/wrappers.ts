import { Deps } from '../entitygateway'

export type UCOutput = {
  message: string
}

export type UCHandler<I, O extends UCOutput> = (input: I) => Promise<O>

type UCWrapper<I, O extends UCOutput> = (
  deps: Deps,
  uc: UCHandler<I, O>,
  ucName: string
) => UCHandler<I, O>

export function wrapUC<I, O extends UCOutput>(
  deps: Deps,
  uc: UCHandler<I, O>,
  ucName: string,
  ...wrappers: UCWrapper<I, O>[]
): UCHandler<I, O> {
  return wrappers.reduce((wrappedUC, wrapper) => {
    return wrapper(deps, wrappedUC, ucName)
  }, uc)
}

export function logMessageWrapper<I, O extends UCOutput>(
  deps: Deps,
  uc: UCHandler<I, O>,
  ucName: string
): UCHandler<I, O> {
  return async (input: I): Promise<O> => {
    const output = await uc(input)
    deps.logger.log(output.message, `app:core:use-cases:${ucName}`)
    return output
  }
}
