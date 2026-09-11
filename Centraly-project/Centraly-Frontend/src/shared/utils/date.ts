export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return '';
  
  let dateObj: Date;
  if (typeof dateString === 'string') {
    let str = dateString;
    // If string has a time component but lacks a timezone indicator ('Z' or offset like '+03:00')
    if (str.includes('T') && !str.endsWith('Z') && !/(?:\+|-)\d{2}:\d{2}$/.test(str)) {
      str += 'Z';
    }
    dateObj = new Date(str);
  } else {
    dateObj = new Date(dateString);
  }

  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function toUtcStartOfDayISOString(dateString: string): string {
  const localDate = new Date(dateString);
  localDate.setHours(0, 0, 0, 0);
  return localDate.toISOString();
}

export function toUtcEndOfDayISOString(dateString: string): string {
  const localDate = new Date(dateString);
  localDate.setHours(23, 59, 59, 999);
  return localDate.toISOString();
}
