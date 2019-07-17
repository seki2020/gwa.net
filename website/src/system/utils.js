'use strict'

export function isArray (arg) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arg)
  }

  return Object.prototype.toString.call(arg) === '[object Array]'
}

export function isEmpty (value) {
  if (isArray(value)) {
    return !value.length
  } else if (value === undefined || value === null) {
    return true
  } else {
    return !String(value).trim().length
  }
}

// module.exports.isEqual = function (o1, o2) {
//   return deepEqual(o1, o2);
// };

export function isFunction (arg) {
  return typeof arg === 'function'
}

export function isNaN (arg) {
  return /^\s*$/.test(arg) || isNaN(arg)
}

export function isNull (arg) {
  return arg === null
}

export function isString (arg) {
  return typeof arg === 'string' || arg instanceof String
}

export function isUndefined (arg) {
  return typeof arg === 'undefined'
}
