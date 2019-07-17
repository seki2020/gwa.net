import { translate as _ } from '../../translator'
import { isEmpty, isString } from '../../utils'

export function required (value) {
  if (value !== null && value !== undefined) {
    value = value.toString()
  }

  if (isString(value)) {
    value = value.trim()
  }

  return [!isEmpty(value), _('This field is required.')]
}
