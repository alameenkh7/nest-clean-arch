import { TransformableInfo } from 'logform'
import { format } from 'winston'

export interface Opts {
  size: number
}

export function _levelZipFormatter(info: TransformableInfo, opts?: Opts) {
  const upperLevel = info.level.toUpperCase()

  const zippedLevel = opts ? upperLevel.substring(0, opts.size) : upperLevel

  info.level = zippedLevel
  return info
}

export const levelZipFormatter = format(_levelZipFormatter)
