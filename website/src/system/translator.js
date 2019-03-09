// Translates the text inside the javascript
// var TRANSLATED_MESSAGES = {};
// function _(message) {
//     if (TRANSLATED_MESSAGES != undefined && TRANSLATED_MESSAGES[message]) {
//         return TRANSLATED_MESSAGES[message];
//     }
//     return message;
// }

// import {TRANSLATED_MESSAGES as nl} from 'locale/nl'
// import {TRANSLATED_MESSAGES as en} from 'locale/en'

// const languages = {
//   'nl': nl,
//   'en': en
// }

// var lang = navigator.language
// var locale = lang.substr(0, 2) === 'nl' ? 'nl': 'en'

// const translations = languages[locale]

export function translate (message) {
  // if (translations !== undefined && translations[message]) {
  //     return translations[message];
  // }
  return message
}
