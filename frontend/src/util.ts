import { DateTime, Duration } from 'luxon'

/**
 * Formats count to human-readable form
 * - K: thousand, e.g., 3,621 -> 3.6K
 * - M: million, 4,768,058 -> 4.8M
 * - B: billion, 15,234,346,566 -> 15.2B
 *
 * @param x number to format
 */
export function formatCount(x: number) {
  if (x === 0) return '0'

  const unit = ['', 'K', 'M', 'B'] as const

  const exponent = Math.floor(Math.log(x) / Math.log(1000)) // upper bound
  const divisor = Math.pow(1000, exponent)
  const precision = divisor < 1000 ? 0 : 1

  return (
    `${(x / divisor).toFixed(precision)}` +
    (unit[exponent] ?? `E${3 * exponent}`)
  )
}

export function formatDateTime(isoDateTime: string) {
  const dateTime = DateTime.fromISO(isoDateTime)
  if (!dateTime.isValid) return ''

  const defaultFormat = dateTime.toFormat('MMM d, yyyy')

  const diffNow = dateTime.diffNow().negate()
  if (diffNow < Duration.fromObject({ days: 8 })) {
    return dateTime.toRelative()
  }

  return `on ${defaultFormat}`
}
