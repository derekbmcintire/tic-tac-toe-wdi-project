const store = require('../store.js')

const wins = [
  ['0', '1', '2'],
  ['3', '4', '5'],
  ['6', '7', '8'],
  ['0', '3', '6'],
  ['1', '4', '7'],
  ['2', '5', '8'],
  ['0', '4', '8'],
  ['2', '4', '6']
]

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
  $('#side-title-div').show()
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

// check win history for current user
const checkWinHistory = function (allGames) {
  let allWins = 0
  allGames.games.map((obj) => {
    const gameBoard = obj.cells
    const xFinal = []
    const oFinal = []
    gameBoard.map((cell, i) => {
      if (cell === 'X') {
        return xFinal.push(i)
      } else {
        return oFinal.push(i)
      }
    })
    if (checkPastWin(xFinal)) {
      allWins++
    }
  })
  return allWins
}

// check a users past game for win
const checkPastWin = function (tracked) {
  const trackedToStrings = tracked.map((x) => {
    return x.toString()
  })
  for (let i = 0; i < wins.length; i++) {
    if (
      trackedToStrings.includes(wins[i][0]) &&
      trackedToStrings.includes(wins[i][1]) &&
      trackedToStrings.includes(wins[i][2])
    ) {
      return true
    }
  }
}

const getGamesSuccess = function (data) {
  $('#player-history').text(store.user.email)
  $('#games-played').text(' ' + data.games.length)
  $('#games-won').text(' ' + checkWinHistory(data) + ' games')
}

const getGamesFailure = function () {
  $('#player-history').text(store.user.email)
  $('#games-played').text('Error finding game history')
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
