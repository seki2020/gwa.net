import { translate as _ } from '../../translator'
import { isArray } from '../../utils'

// https://jqueryvalidation.org/jQuery.validator.format/
function messageFormat (source, params) {
  // debugger
  if (arguments.length === 1) {
    // console.log("what is this?")
    return function () {
      // var args = $.makeArray( arguments );
      var args = [].slice.call(arguments)
      args.unshift(source)
      return messageFormat(source, args)
    }
  }
  if (params === undefined) {
    return source
  }
  if (arguments.length > 2 && params.constructor !== Array) {
    params = [].slice.call(arguments).slice(1)
    // params = $.makeArray( arguments ).slice( 1 );
  }
  if (params.constructor !== Array) {
    params = [params]
  }
  // $.each(params, function (i, n) {
  //   source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), function () {
  //     return n
  //   })
  // })
  return source
}

export function minLength (value, args) {
  var length = isArray(value) ? value.length : String(value).length
  return [length >= args, messageFormat(_('Please enter at least {0} characters.'), args)]
}

export function maxLength (value, args) {
  var length = isArray(value) ? value.length : String(value).length
  return [length <= args, messageFormat(_('Please enter no more than {0} characters.'), args)]
}
