import { Field } from './field'

export function Validator () {
  this.fields = {}
}

// Validator.prototype._setVM = function(vm) {
//     this._vm = vm
// }

Validator.prototype.setField = function (field, validators) {
  if (!(field in this.fields)) {
    this.fields[field] = new Field(field, validators)
  }
}

Validator.prototype.validate = function (field, value) {
  if (field in this.fields) {
    var valid = this.fields[field].validate(field, value)

    console.log('  ** Valid: ' + valid)
  }
}

Validator.prototype.isValid = function (field) {
  if (field in this.fields) {
    return this.fields[field].isValid()
  }
  return true
}

Validator.prototype.errors = function (field) {
  if (field in this.fields) {
    return this.fields[field].errors
  }
  return []
}
