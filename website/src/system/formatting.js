// import { formatNumber, formatInteger, formatCurrency, formatPercentage } from './numbers'
// import { formatDate, formatTime, formatDateTime, formatCustomDateTime, formatDateTimeDelta } from './dates'
// import { hideZero} from './zero'
// import * as IBAN from 'ibantools'
import { formatDate } from './formatters/dates'

export default {
  install: function (Vue, options) {
    // Vue.filter("formatNumber", formatNumber)
    // Vue.filter("formatInteger", formatInteger)
    // Vue.filter("formatCurrency", formatCurrency)
    // Vue.filter("formatPercentage", formatPercentage)

    // Vue.filter("formatTime", formatTime)
    Vue.filter('formatDate', formatDate)
    // Vue.filter("formatDateTime", formatDateTime)
    // Vue.filter("formatCustomDateTime", formatCustomDateTime)
    // Vue.filter("formatDateTimeDelta", formatDateTimeDelta)

    // Vue.filter("hideZero", hideZero)

    // Vue.filter("showDefault", (v, def='') => v ? v : def)

    // Vue.filter("formatIBAN", IBAN.friendlyFormatIBAN)
  }
}
