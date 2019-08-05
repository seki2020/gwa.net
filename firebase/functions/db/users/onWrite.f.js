const functions = require('firebase-functions')
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
// try {admin.initializeApp()} catch(e) {} // You do that because the admin SDK can only be initialized once.

const { getAction, isPropDirty } = require('../utils')


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

      let firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
      /* {  databaseURL: 'https://databaseName.firebaseio.com',
             storageBucket: 'projectId.appspot.com',
             projectId: 'projectId' }
      */
      console.log('Config: ', firebaseConfig)

      // Storage bucket
      const bucket = admin.instanceId().app.options.storageBucket
      console.log('Bucket: ', bucket)

      if (action === 'update' && isPropDirty('name', oldDocument, newDocument)) {
        console.log(" - update the name")
      }

      return true
    })
