const getFormFields = require(`../../../lib/get-form-fields`)
const api = require('./api')
const ui = require('./ui')

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

// hide gameboard
const hideBoard = function () {
  $('.game-container').hide()
}

$('#info').hide()

// show info
const showInfo = function () {
  $('#info').show()
}

// show gameboard
// const showBoard = function () {
//   $('.sign-in-container').hide()
//   $('.game-container').show()
// }

// hide sign in form
const hideSignIn = function () {
  $('#form-sign-in').hide()
}

// show sign in form
const showSignIn = function () {
  $('#button-wrap').hide()
  hideSignUp()
  $('#form-sign-in').show()
}

// hide sign up form
const hideSignUp = function () {
  $('#form-sign-up').hide()
}
// show sign up form
const showSignUp = function () {
  $('#button-wrap').hide()
  hideSignIn()
  $('#form-sign-up').show()
}

$('#sign-in').on('click', showSignIn)
$('#sign-up').on('click', showSignUp)
$('#back-to-sign-up').on('click', showSignUp)
$('#back-to-sign-in').on('click', showSignIn)

// on sign up
const onSignUp = function (event) {
  const data = getFormFields(event.target)
  console.log(data)
  event.preventDefault()
  api.signUp(data)
    .then(ui.signUpSuccess)
    .catch(ui.signUpFailure)
}

// on sign in
const onSignIn = function (event) {
  const data = getFormFields(event.target)
  console.log(data)
  event.preventDefault()
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

// on create game
const onCreateGame = function (event) {
  event.preventDefault()
  api.createGame()
    .then(ui.createGameSuccess)
    .catch(ui.createGameFailure)
}

// check for tie
const checkTie = function () {
  const used = xTrack.concat(oTrack)
  if (used.length === 9 && !winner) {
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
  trackMove(this)
  checkWin(xTrack)
  checkWin(oTrack)
  switchTurn()
  displayTurn()
  displayWinner()
  checkTie()
}

// add onClick event to all squares
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
  startGame()
}

// start a new game on button click
$('#new-game').on('click', function () {
  clearGame()
  showInfo()
})

// disable all squares at end of game-board-wrap
const endGame = function () {
  squares.map((x) => $('#' + x).off('click'))
}

// check for win
function checkWin (tracked) {
  for (let i = 0; i < win.length; i++) {
    if (
      tracked.includes(win[i][0]) &&
      tracked.includes(win[i][1]) &&
      tracked.includes(win[i][2])
    ) {
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
    const winningPlayer = xTurn ? 'Player 2' : 'Player 1'
    $('#info').text(winningPlayer + ' has won!')
    endGame()
  }
}

startGame()
hideBoard()
hideSignIn()
hideSignUp()

module.exports = {
  onSignUp,
  onSignIn,
  onSignOut,
  onChangePassword,
  onCreateGame
}
