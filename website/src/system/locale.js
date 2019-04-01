export function getLocale () {
  var lang = navigator.language
  return lang.substr(0, 2) === 'nl' ? 'nl' : 'en'
}
