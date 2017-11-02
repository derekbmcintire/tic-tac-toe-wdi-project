const signUpSuccess = function (data) {
  $('#message').text('Signed up successfully')
  console.log('ui is working and sign up successful')
}

const signUpFailure = function () {
  $('#message').text('Error on sign up')
  console.log('ui is working and sign up failure')
}

module.exports = {
  signUpSuccess,
  signUpFailure
}
