import axios from 'axios'
import firebase from 'firebase/app'

// function status(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return Promise.resolve(response)
//   } else {
//     return Promise.reject(new Error(response.statusText))
//   }
// }

// function json(response) {
//   return response.json()
// }
export default {
  get: function (url) {
    var user = firebase.auth().currentUser
    if (user) {
      return user.getIdToken()
        .then((token) => {
          const options = {
            headers: { 'Authorization': 'Bearer ' + token }
          }
          return axios.get(url, options)
        })
        // .then(response => {
        //   return response
        // })
        .catch(err => {
          console.log(err)
        })
    } else {
      return Promise.resolve(null)
    }
  },
  post: async (url, params) => {
    var user = firebase.auth().currentUser
    if (user) {
      try {
        const token = await user.getIdToken()
        const options = {
          headers: { 'Authorization': 'Bearer ' + token }
        }
        return axios.post(url, params, options)
      } catch (err) {
        console.log(err)
      }
    } else {
      return Promise.resolve(null)
    }
  }
}
