const admin = require('firebase-admin')

const userId = 'Mw9os612DzNrX0zn0NlTUmMbhf92'
const userData = {
  name: 'Demo user',
  bio: 'Testing'
}

const tripId = 'TXt1XIvqUDzBP6T11xTF'
const tripData = {
  name: 'Latest Test Trip',
  shared: true,
  user: {
    id: userId,
    name: userData.name
  },
  created: admin.firestore.Timestamp.fromDate(new  Date()),
  updated: admin.firestore.Timestamp.fromDate(new  Date())
}

const followerData = {
  trip: {
    id: tripId,
    name: tripData.name,
    shared: tripData.shared
  },
  user : {
    id: userId,
    name: userData.name
  },
  role: 'owner',
  created: tripData.created,
  updated: tripData.updated
}

const postId = 'AABBCC'
const postData = {
  date: admin.firestore.Timestamp.fromDate(new  Date()),
  message: 'Test post',
  timeZone: "Europe/Amsterdam",
  timeZoneOffset: 120,
  trip: {
    id: tripId,
    name: tripData.name,
  },
  user : {
    id: userId,
    name: userData.name
  },
}

module.exports.userId = userId
module.exports.userData = userData
module.exports.tripId = tripId
module.exports.tripData = tripData
module.exports.followerData = followerData
module.exports.postId = postId
module.exports.postData = postData
