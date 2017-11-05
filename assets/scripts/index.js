'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const events = require('./tic-tac-toe/events.js')

$(() => {
  setAPIOrigin(location, config)
  $('#sign-in').on('click', events.showSignIn)
  $('#sign-up').on('click', events.showSignUp)
  $('#back-to-sign-up').on('click', events.showSignUp)
  $('#back-to-sign-in').on('click', events.showSignIn)
  $('#form-sign-up').on('submit', events.onSignUp)
  $('#form-sign-in').on('submit', events.onSignIn)
  $('#new-game').on('click', events.onCreateGame)
  $('#sign-out-button').on('click', events.onSignOut)
  $('#form-change-password').on('submit', events.onChangePassword)
  $('#game-history').on('click', events.onGetGames)
  $('#comp-play').on('click', events.onCompPlay)
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
