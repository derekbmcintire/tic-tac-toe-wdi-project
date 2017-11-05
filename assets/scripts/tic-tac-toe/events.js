const getFormFields = require(`../../../lib/get-form-fields`)
const api = require('./api')
const ui = require('./ui')
const store = require('../store.js')

/**************** SET UP ***********************************/

// hide game container and sign in/sign up forms
$('.game-container').hide()
$('#side-title-div').hide()
$('#form-sign-in').hide()
$('#form-sign-up').hide()

/************* API SIGN IN/SIGN OUT *************************/

// show sign in form
const showSignIn = function () {
  $('#button-wrap').hide()
  $('#form-sign-up').hide()
  $('#form-sign-in').show()
}

// show sign up form
const showSignUp = function () {
  $('#button-wrap').hide()
  $('#form-sign-in').hide()
  $('#form-sign-up').show()
}

// on sign up
const onSignUp = function (event) {
  const data = getFormFields(event.target)
  event.preventDefault()
  api.signUp(data)
    .then(ui.signUpSuccess)
    .catch(ui.signUpFailure)
}

// on sign in
const onSignIn = function (event) {
  const data = getFormFields(event.target)
  event.preventDefault()
  clearGame()
  $('#info').hide()
  api.signIn(data)
    .then(ui.signInSuccess)
    .catch(ui.signInFailure)
}

// on sign out
const onSignOut = function (event) {
  event.preventDefault()
  api.signOut()
    .then(ui.signOutSuccess)
    .catch(ui.signOutFailure)
}

// on change password
const onChangePassword = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  api.changePassword(data)
    .then(ui.changePasswordSuccess)
    .catch(ui.changePasswordFailure)
}

/***************** API GAME HANDLERS ********************/

// on create game
const onCreateGame = function (event) {
  event.preventDefault()
  api.createGame()
    .then(ui.createGameSuccess)
    .catch(ui.createGameFailure)
}

// on update game
const onUpdateGame = function (event) {
  api.updateGame(store.currentGameState)
    .then(ui.updateGameSuccess)
    .catch(ui.updateGameFailure)
}

// on get games
const onGetGames = function (event) {
  event.preventDefault()
  api.getGames()
    .then(ui.getGamesSuccess)
    .catch(ui.getGamesFailure)
}

/***************** GAME LOGIC ************************/

let wins1 = 0
let wins2 = 0
// display number of wins for each player
$('#1-wins').text(wins1)
$('#2-wins').text(wins2)

let xTurn = true
let winner = false
let xTrack = []
let oTrack = []
const squares = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
const win = [
  ['0', '1', '2'],
  ['3', '4', '5'],
  ['6', '7', '8'],
  ['0', '3', '6'],
  ['1', '4', '7'],
  ['2', '5', '8'],
  ['0', '4', '8'],
  ['2', '4', '6']
]

// check for tie
const checkTie = function () {
  const used = xTrack.concat(oTrack)
  if (used.length === 9 && !winner) {
    store.currentGameState.game.over = true
    $('#info').text('It\'s a tie!')
  }
}

// switch turns between X and O
const switchTurn = () => {
  xTurn ? xTurn = false : xTurn = true
}

// track X and O moves in separate arrays
const trackMove = function (square) {
  if (xTurn) {
    xTrack.push(square.id)
  } else {
    oTrack.push(square.id)
  }
}

// add symbols to board and disable click function
const onSquareClick = function () {
  const currentLetter = xTurn ? 'X' : 'O'
  $(this).text(currentLetter)
  $(this).off('click')
  store.currentGameState.game.cell.index = this.id
  store.currentGameState.game.cell.value = currentLetter
  trackMove(this)
  checkWin(xTrack)
  checkWin(oTrack)
  switchTurn()
  displayTurn()
  displayWinner()
  checkTie()
  onUpdateGame()
}

// add click event to all squares
const startGame = function () {
  xTurn = true
  winner = false
  xTrack = []
  oTrack = []
  squares.map((x) => $('#' + x).on('click', onSquareClick))
  displayTurn()
}

// clear gameboard and reset game
const clearGame = function () {
  endGame()
  squares.map((x) => $('#' + x).text(''))
}

// disable all squares at end of game-board-wrap
const endGame = function () {
  squares.map((x) => $('#' + x).off('click'))
}

// start a new game on button click
$('#new-game').on('click', function () {
  clearGame()
  $('#info').show()
  startGame()
})

// check for win
function checkWin (tracked) {
  for (let i = 0; i < win.length; i++) {
    if (
      tracked.includes(win[i][0]) &&
      tracked.includes(win[i][1]) &&
      tracked.includes(win[i][2])
    ) {
      endGame()
      return (winner = true)
    }
  }
}

// display who's turn it is
const displayTurn = function () {
  const currentPlayer = xTurn ? 'X' : 'O'
  $('#info').text(currentPlayer + '\'s turn!')
}

// display winner in the info element and disable squares
const displayWinner = function () {
  if (winner) {
    store.currentGameState.game.over = true
    const winningPlayer = xTurn ? '2' : '1'
    if (winningPlayer === '1') {
      $('#1-wins').text(wins1 + 1)
      wins1++
    } else {
      $('#2-wins').text(wins2 + 1)
      wins2++
    }
    $('#info').text('Player ' + winningPlayer + ' has won!')
  }
}

module.exports = {
  onSignUp,
  onSignIn,
  onSignOut,
  showSignIn,
  showSignUp,
  onChangePassword,
  onCreateGame,
  endGame,
  onUpdateGame,
  onGetGames
}
