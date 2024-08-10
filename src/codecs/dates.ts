import dayjs from 'dayjs'
import * as t from 'io-ts'

const MYSQL_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const MysqlDateTimeCodec = new t.Type<Date, string>(
  'MysqlDateTimeCodec',
  (u: unknown): u is Date => {
    return u !== null && u instanceof Date
  },
  (i: unknown, context: t.Context): t.Validation<Date> => {
    if (typeof i === 'string') {
      const date = dayjs(i, MYSQL_DATETIME_FORMAT, true)

      if (!date.isValid()) {
        return t.failure(i, context, 'Invalid DateTime string format')
      }

      return t.success(date.toDate())
    }

    if (typeof i === 'object' && i instanceof Date) {
      return t.success(i)
    }

    return t.failure(i, context, 'Invalid DateTime data type')
  },
  (a: Date): string => {
    return dayjs(a).format('YYYY-MM-DD HH:mm:ss')
  }
)
