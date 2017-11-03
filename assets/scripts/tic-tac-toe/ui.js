const signUpSuccess = function (data) {
  $('#message').text('Signed up successfully')
  $('.sign-in-container').hide()
  $('.game-container').show()
  $('#user-display').text(data.email)
  console.log(data)
}

const signUpFailure = function () {
  $('#message').text('Error on sign up')
}

const signInSuccess = function (data) {
  $('#message').text('Signed in successfuly')
  $('.sign-in-container').hide()
  $('.game-container').show()
  $('#user-display').text(data.user.email)
  console.log(data)
}

const signInFailure = function () {
  $('#message').text('Error on sign in')
}

module.exports = {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure
}
