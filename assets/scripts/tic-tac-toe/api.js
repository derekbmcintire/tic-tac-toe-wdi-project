const config = require('../config')
const store = require('../store.js')

const signUp = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-up',
    method: 'POST',
    data
  })
}

const signIn = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-in',
    method: 'POST',
    data
  })
}

const signOut = function () {
  return $.ajax({
    url: config.apiOrigin + '/sign-out/' + store.user.id,
    method: 'DELETE',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const changePassword = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/change-password/' + store.user.id,
    method: 'PATCH',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

const createGame = function () {
  return $.ajax({
    url: config.apiOrigin + '/games',
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const updateGame = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/games/' + store.user.id,
    method: 'POST',
    headers: {
      Authorization: 'Token token=' + store.user.token
    },
    data: store.game
  })
}



// {
//   "game": {
//     "cell": {
//       "index": 0,
//       "value": "x"
//     },
//     "over": false
//   }
// }

// API="${API_ORIGIN:-http://tic-tac-toe.wdibos.com}"
// URL_PATH="/games/${ID}"
//
// curl "${API}${URL_PATH}" \
//   --include \
//   --request PATCH \
//     --header "Authorization: Token token=${TOKEN}" \
//   --header "Content-Type: application/json" \
//   --data '{
//   "game": {
//     "cell": {
//       "index": 0,
//       "value": "x"
//     },
//     "over": false
//   }
// }'


module.exports = {
  signUp,
  signIn,
  signOut,
  changePassword,
  createGame
}
