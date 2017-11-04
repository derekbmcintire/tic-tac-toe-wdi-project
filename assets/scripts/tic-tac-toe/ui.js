const store = require('../store.js')
const event = require('./events.js')

const signUpSuccess = function (data) {
  $('#form-sign-up').hide()
  $('#form-sign-in').show()
}

const signUpFailure = function () {
  $('#message-up').text('Something went wrong, please try again')
}

const signInSuccess = function (data) {
  $('.sign-in-container').hide()
  $('.game-container').show()
  $('#user-display').text(data.user.email)
  store.user = data.user
}

const signInFailure = function () {
  $('#message-in').text('Please try again')
}

const signOutSuccess = function () {
  $('.game-container').hide()
  $('.sign-in-container').show()
  $('#message-in').text('You have been signed out')
}

const signOutFailure = function () {
  console.log('sign out failed')
}

const changePasswordSuccess = function () {
  $('#form-change-password').hide()
  $('#message-change').text('Your password has been changed')
}

const changePasswordFailure = function () {
  $('#message-change').text('Error: password not changed')
}

const createGameSuccess = function (data) {
  store.game = data.game
  console.log(store.game)
}

const createGameFailure = function () {
  console.log('failed to create new game')
}

const updateGameSuccess = function (data) {
  store.game = data.game
  console.log(store.game)
}

const updateGameFailure = function () {
  console.log('failed to update game')
}

const getGamesSuccess = function (data) {
  $('#player-history').text(store.user.email)
  $('#games-played').text(' ' + data.games.length)
  console.log(store.allGames)
}

const getGamesFailure = function () {

}

module.exports = {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  changePasswordSuccess,
  changePasswordFailure,
  createGameSuccess,
  createGameFailure,
  updateGameSuccess,
  updateGameFailure,
  getGamesSuccess,
  getGamesFailure
}
