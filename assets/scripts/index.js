'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const events = require('./tic-tac-toe/events.js')

$(() => {
  setAPIOrigin(location, config)
  for (let i = 0; i < 9; i++) {
    $('#' + i).on('click', events.onSquareClick)
  }
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')