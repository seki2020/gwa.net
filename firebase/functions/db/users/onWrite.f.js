const functions = require('firebase-functions')
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.

function getAction(change) {
  const oldDocument = change.before.exists ? change.before.data(): null
  const newDocument = change.after.exists ? change.after.data() : null

  const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'

  return [action, oldDocument, newDocument]
}

function isDirty(prop, oldDocument, newDocument) {
  if (oldDocument === null && newDocument === null) {   // Both null -> NOT dirty
    return false
  }
  if (oldDocument === null || newDocument === null) {   // One of them null -> dirty
    return true
  }
  if (oldDocument[prop] !== newDocument[prop]) {
    return true
  }
  return false
}

exports = module.exports = functions.firestore
    .document('users/{userId}')
    .onWrite((change, context) => {
      // Get an object representing the document
      // const oldDocument = change.before.exists ? change.before.data(): null
      // const newDocument = change.after.exists ? change.after.data() : null

      // const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'
      // console.log('Action: ', action)

      const [action, oldDocument, newDocument] = getAction(change)
      console.log('Action: ', action)
      console.log('Old: ', oldDocument)
      console.log('New: ', newDocument)


      const options = admin.instanceId().app.options
      console.log('Options: ', options)

      // Storage bucket
      const bucket = admin.instanceId().app.options.storageBucket

      if (action === 'update' && isDirty('name', oldDocument, newDocument)) {
        console.log(" - update the name")
      }

      return true
    })
