
export function formatDate(
  dateInput: string | Date | undefined | null,
  options: {
    includeTime?: boolean
    relative?: boolean
    dateStyle?: 'full' | 'long' | 'medium' | 'short'
  } = {}
): string {
  if (!dateInput) return 'No date'

  const date = new Date(dateInput)
  
  
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  
  if (options.relative) {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    }
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit)
      if (interval >= 1) {
        return interval === 1 
          ? `${interval} ${unit} ago` 
          : `${interval} ${unit}s ago`
      }
    }
    
    return 'Just now'
  }

  
  const locale = navigator.language || 'en-US'
  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: options.dateStyle || 'medium',
    ...(options.includeTime && { timeStyle: 'short' })
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(date)
}


export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date range'
  }

  
  if (start.toDateString() === end.toDateString()) {
    return formatDate(start, { includeTime: true })
  }

  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${formatDate(end)}`
  }

  
  if (start.getFullYear() === end.getFullYear()) {
    return `${formatDate(start, { dateStyle: 'short' })} - ${formatDate(end, { dateStyle: 'short' })}`
  }

  
  return `${formatDate(start)} - ${formatDate(end)}`
}


export function isToday(date: Date | string): boolean {
  const checkDate = new Date(date)
  const today = new Date()
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}


export function isFuture(date: Date | string): boolean {
  return new Date(date) > new Date()
}