import { TransformableInfo } from 'logform'
import { format } from 'winston'

interface ContextFormatterOpts {
  removeContextFromMeta: boolean
}

const colorCodes = [
  20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
  69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
  135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
  172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
  205, 206, 207, 208, 209, 214, 215, 220, 221,
]

function selectColor(namespace: string) {
  let hash = 0

  for (let i = 0; i < namespace.length; i++) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }

  return colorCodes[Math.abs(hash) % colorCodes.length]
}

export function _contextFormatter(
  info: TransformableInfo,
  opts: ContextFormatterOpts
) {
  if (!info.message) {
    return info
  }

  if (!info.context) {
    return info
  }

  const contextColoredText = `\u001B[38;5;${selectColor(info.context)};1m${
    info.context
  }\u001B[0m`

  info.message = `${contextColoredText} ${info.message}`

  if (opts.removeContextFromMeta) {
    delete info.context
  }

  return info
}

export const contextFormatter = format(_contextFormatter)
