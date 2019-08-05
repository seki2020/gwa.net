module.exports.getAction = function (change) {
  const oldDocument = change.before.exists ? change.before.data(): null
  const newDocument = change.after.exists ? change.after.data() : null

  const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'

  return [action, oldDocument, newDocument]
}

module.exports.isPropDirty = function (prop, oldDocument, newDocument) {
  if (oldDocument === null && newDocument === null) {   // Both null -> NOT dirty
    return false
  }
  if (oldDocument === null || newDocument === null) {   // One of them null -> dirty
    return true
  }
  if (JSON.stringify(oldDocument[prop]) !== JSON.stringify(newDocument[prop])) {
    return true
  }
  return false
}

