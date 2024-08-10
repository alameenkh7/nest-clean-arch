import _, { get, isArray, isObject } from 'lodash'
/**
 *
 * @param obj object to fix
 * @returns the object fixed
 *
 * "createdAt": {
 *   "__datatype__": "timestamp",
 *   "value": "2022-04-11T10:26:35.116Z"
 * }
 */
export function revive(obj: any): any {
  if (
    _.isNumber(obj) ||
    _.isString(obj) ||
    _.isNull(obj) ||
    _.isUndefined(obj)
  ) {
    return obj
  }

  if (isObject(obj) && get(obj, '__datatype__') === 'timestamp') {
    const value = get(obj, 'value')
    return new Date(value)
  }

  if (isArray(obj)) {
    return obj.map(revive)
  }

  if (isObject(obj)) {
    const fixedObj: { [k: string]: unknown } = {}

    _.forEach(obj, (val, key: string) => {
      fixedObj[key] = revive(val)
    })

    return fixedObj
  }
}

export function replacer(key: any, value: any): any {
  if (this[key] instanceof Date) {
    return {
      __datatype__: 'timestamp',
      value: this[key].toISOString(),
    }
  }

  return value
}
