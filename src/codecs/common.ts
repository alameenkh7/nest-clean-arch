import { isLeft } from 'fp-ts/lib/Either'
import * as t from 'io-ts'
import reporter from 'io-ts-reporters'

/**
 * Generate a codec for the specified enum, this reduce a lot
 * the verbisity of the enum codecs
 *
 * @param enumName
 * @param theEnum
 *
 * WARNING: Use this function only with string enums
 *
 * Example:
 *
 * enum MyEnum {
 *  A = 'A',
 *  B = 'B',
 * }
 *
 * const myEnumCodec = fromEnum<MyEnum>('MyEnum', MyEnum)
 */

export function fromEnum<EnumType>(
  enumName: string,
  theEnum: Record<string, string | number>
) {
  const isEnumValue = (input: unknown): input is EnumType =>
    Object.values<unknown>(theEnum).includes(input)

  return new t.Type<EnumType>(
    enumName,
    isEnumValue,
    (input, context) =>
      isEnumValue(input) ? t.success(input) : t.failure(input, context),
    t.identity
  )
}

/**
 * @param validation The decode result object
 * @param message An explicit error message
 * @returns Your explicit error message plus a descriptive message on what is wrong
 * is going wrong with your decode
 *
 * Example of usage:
 *
 * const decodeResult = SessionCodec.decode(req.session)
 *
 *  if (isRight(decodeResult)) {
 *    res.locals.context.session = decodeResult.right
 *    debug('decode ok')
 *  } else {
 *    debug(stringDecodeError(decodeResult, 'Unable to decode session data'))
 *  }
 */
export function stringDecodeError<T>(
  validation: t.Validation<T>,
  message: string
) {
  return `${message}\n${reporter.report(validation).join('\n')}`
}

/**
 * @param data The data to decode
 * @param codec The codec to use
 * @returns The decoded data
 * @throws Will throw an error if the data cannot be decoded
 */
export function decode<A, O = A, I = unknown>(
  data: I,
  codec: t.Type<A, O, I>
): A {
  const decoded = codec.decode(data)

  if (isLeft(decoded)) {
    throw stringDecodeError(decoded, `Cannot decode ${JSON.stringify(data)}`)
  }

  return decoded.right
}
