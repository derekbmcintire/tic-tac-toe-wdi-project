'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const api = require('./tic-tac-toe/api')
const events = require('./tic-tac-toe/events.js')

$(() => {
  setAPIOrigin(location, config)
  events.newTest()
  $('#form-sign-up').on('submit', events.onSignUp)
  $('#form-sign-in').on('submit', events.onSignIn)
  $('#sign-out-button').on('click', events.onSignOut)
  // $('#change-password').on('submit', onChangePassword)
  // $('#sign-out').on('submit', onSignOut)
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
