'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const events = require('./tic-tac-toe/events.js')

$(() => {
  setAPIOrigin(location, config)
  $('#sign-in').on('click', events.showSignIn)
  $('#sign-up').on('click', events.showSignUp)
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
