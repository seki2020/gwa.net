// import { getLocale } from '../locale'
import { parse, format } from 'date-fns'

export function formatDate (date, long) {
  if (!date) {
    return ''
  }
  // Very simple function for now, later deal with locales
  // console.log('dates', getLocale())

  return format(parse(date), 'DD-MM-YYYY')
}
