const store = require('../store.js')

const signUpSuccess = function (data) {
  $('.sign-in-container').hide()
  $('.game-container').show()
  $('#user-display').text(data.email)
  console.log(data)
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

module.exports = {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  signOutSuccess
}
