import { format } from 'date-fns';

export function toDate(date: Date | number | null) {
  if (!date) {
    return null;
  }
  return format(date, 'yyyy-MM-dd');
}

export function toDateTime(date: Date | number | null) {
  if (!date) {
    return null;
  }
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function excerpt(text?: string, length: number = 50, append = '...') {
  if (text && text?.length > length) {
    return text.slice(0, length) + append;
  }
  return text;
}
