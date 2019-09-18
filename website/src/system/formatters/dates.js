// import { getLocale } from '../locale'
import { parseISO, format } from 'date-fns'

export function formatDate (date, long) {
  if (!date) {
    return ''
  }
  // Very simple function for now, later deal with locales
  // console.log('dates', getLocale())

  return format(parseISO(date), 'dd-MM-yyyy')
}
