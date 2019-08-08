const admin = require('firebase-admin')

module.exports.setup = async () => {
  await admin.initializeApp()

  return admin.firestore();
};

module.exports.teardown = async () => {
  // Promise.all(firebase.apps().map(app => app.delete()));
};

