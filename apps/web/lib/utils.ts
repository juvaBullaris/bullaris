import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as DKK currency string (da-DK locale)
 */
export function formatDKK(amount: number, decimals = 0): string {
  return (
    amount.toLocaleString('da-DK', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + ' kr.'
  )
}

/**
 * Format a number as a percentage
 */
export function formatPct(rate: number, decimals = 1): string {
  return (rate * 100).toFixed(decimals) + '%'
}
