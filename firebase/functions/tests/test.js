const admin = require('firebase-admin')

admin.initializeApp()

const db = admin.firestore()

const userId = 'HVLCYVjM8Xd6bTvPohEky9NwgaF2'

var data = {
  id: userId,
  name: 'Aadje',
  bio: 'joepie'
}

const userRef = db.collection("users").doc(userId);
return userRef.set(data)    
  .then(() => {
    console.log('Done')
    return true
  })
  .catch(err => {
    console.log('Error: ', err);
  })

