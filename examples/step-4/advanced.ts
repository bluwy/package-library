import { createHash } from 'node:crypto'

export function getHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 8)
}
