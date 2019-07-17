'use strict';

module.exports.isArray = function (arg) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arg);
  }

  return Object.prototype.toString.call(arg) === '[object Array]';
};

module.exports.isEmpty = function (value) {
  if (module.exports.isArray(value)) {
    return !value.length;
  } else if (value === undefined || value === null) {
    return true;
  } else {
    return !String(value).trim().length;
  }
};

// module.exports.isEqual = function (o1, o2) {
//   return deepEqual(o1, o2);
// };

module.exports.isFunction = function (arg) {
  return typeof arg === 'function';
};

module.exports.isNaN = function (arg) {
  return /^\s*$/.test(arg) || isNaN(arg);
};

module.exports.isNull = function (arg) {
  return arg === null;
};

module.exports.isString = function (arg) {
  return typeof arg === 'string' || arg instanceof String;
};

module.exports.isUndefined = function (arg) {
  return typeof arg === 'undefined';
};


