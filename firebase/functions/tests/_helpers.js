const admin = require('firebase-admin')

module.exports.setup = async () => {
  console.log('Setup')
  await admin.initializeApp()

  return admin.firestore();
  // return null
};

module.exports.teardown = async () => {
  console.log('Teardown')
};

