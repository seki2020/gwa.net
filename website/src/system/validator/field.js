import {isFunction} from '../../system/utils'

import {required} from './rules/required'
import {date} from './rules/date'
import {minLength, maxLength} from './rules/length'

var rules = {
    required: required,
    date: date,
    minLength: minLength,
    maxLength: maxLength
}


export function Field(field, validators) {
    this.name = field
    this.validators = validators

    this.errors = []
    // Do something with the rule
}

Field.prototype.validate = function(field, value) {
    console.log(" ++ Validating: " + field + ", value: " + value)

    var errors = []

    // debugger
    // NOTE: must polyfill Object.entries
    Object.entries(this.validators).forEach(function([rule, args]) {
        // console.log("    * rule: " + rule, ", args: " + args)

        var [valid, msg] = [true, '']
        // var msg

        // Find the rule as a validation
        var validator = rules[rule]
        if (validator) {
            [valid, msg] = validator(value, args)
        }
        else if (isFunction(args)) {
            [valid, msg] = args(value)
        }

        if(!valid) {
            console.log("  - Error: " + msg)
            errors.push(msg)
        }
    })
    this.errors = errors

    return this.isValid()
}

Field.prototype.isValid = function() {
    return (this.errors.length === 0)
}

