'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const api = require('./tic-tac-toe/api')
const events = require('./tic-tac-toe/events.js')
const ui = require('./tic-tac-toe/ui.js')


$(() => {
  setAPIOrigin(location, config)
  $('#form-sign-up').on('submit', events.onSignUp)
  $('#form-sign-in').on('submit', events.onSignIn)
  $('#new-game').on('click', events.onCreateGame)
  // $('#form-sign-in').on('submit', events.onCreateGame)
  $('#sign-out-button').on('click', events.onSignOut)
  $('#form-change-password').on('submit', events.onChangePassword)
  // $('#change-password').on('submit', onChangePassword)
  // $('#sign-out').on('submit', onSignOut)
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
