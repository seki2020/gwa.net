import { Validator } from './validator'

export default {
  beforeMount: function () {
    var validators = this.$options.validators
    if (validators) {
    // if (this.validator) {
    //     this.validator._setVM(this)
    // }
      Object.keys(validators).forEach(function (field) {
        // Add the field to the validator
        this.validator.setField(field, validators[field])

        // Create watcher on the field.
        this.$watch(field, function (value) {
          this.validator.validate(field, value)
        })
      }, this)
    }
  },
  data: function () {
    if (this.$options.validators) {
      return {
        validator: new Validator()
      }
    }
    return {
    }
  }
}
