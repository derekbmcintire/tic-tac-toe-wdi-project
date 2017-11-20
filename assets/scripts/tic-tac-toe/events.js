const getFormFields = require(`../../../lib/get-form-fields`)
const api = require('./api')
const ui = require('./ui')
const store = require('../store.js')
const displays = require('./displays')

/* --------------- SET UP ----------------- */

// hide game container and sign in/sign up forms
$('.game-container').hide()
$('#side-title-div').hide()
$('#form-sign-in').hide()
$('#form-sign-up').hide()

/* ---------------  API SIGN IN/SIGN OUT ----------------- */

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

/* ---------------  API GAME HANDLERS ----------------- */

// on create game
const onCreateGame = function (event) {
  event.preventDefault()
  api.createGame()
    .then(ui.createGameSuccess)
    .catch(ui.createGameFailure)
}

// on update game
const onUpdateGame = function (event) {
  api.updateGame()
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

/* ---------------  GAME LOGIC ----------------- */

let wins1 = 0
let wins2 = 0
// display number of wins for each player
$('#1-wins').text(wins1)
$('#2-wins').text(wins2)

let xTurn = true
let winner = false
let xTrack = []
let oTrack = []
let usedSquares = []
let playComp = false
let player
let comp
// moved lets the computer know it has already made a move when looping through possible moves, so it will not move more than once a turn
let moved
let gameOn = false
let whoWon = ''
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
  if (usedSquares.length === 9 && !winner) {
    store.currentGameState.game.over = true
    $('#info').text('It\'s a tie!')
    endGame()
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

// execute this if clicking on a square in player vs comp mode
const playCompClick = function (square) {
  $('.square').off('click')
  // put X in square if player is X
  if (player === 'X') {
    $(square).text('X')
    store.currentGameState.game.cell.value = 'X'
  } else {
    // put O in square if player is O
    $(square).text('O')
    store.currentGameState.game.cell.value = 'O'
  }

}

// execute this if clicking on a square in player vs player mode
const playVsPlay = function (square) {
  const currentLetter = xTurn ? 'X' : 'O'
  $(square).text(currentLetter)
  store.currentGameState.game.cell.value = currentLetter
}

// execute this on every square click
const allClick = function (square) {
  $(square).off('click')
  store.currentGameState.game.cell.index = square.id
  trackMove(square)
  checkWin(xTrack, 'X')
  checkWin(oTrack, 'O')
  usedSquares = xTrack.concat(oTrack)
  switchTurn()
  displayTurn()
  displayWinner()
  checkTie()
  onUpdateGame()
  moved = false
}

// add symbols to board and disable click function
const onSquareClick = function () {
  if (playComp) {
    playCompClick(this)
  } else {
    playVsPlay(this)
  }
  allClick(this)
  if (playComp) {
  // if there is no winner and the game is still going, computer makes a move
    if (!winner && gameOn) {
      setTimeout(function () {
        compDecide()
      }, 1000)
    }
  }
}

// add click event to all squares, reset variables and display turn
const startGame = function () {
  gameOn = true
  xTurn = true
  winner = false
  xTrack = []
  oTrack = []
  usedSquares = []
  moved = false
  $('.square').on('click', onSquareClick)
  displayTurn()
}

// clear gameboard and reset game
const clearGame = function () {
  endGame()
  $('.square').text('')
}

// disable all squares at end of game-board-wrap
const endGame = function () {
  $('.square').off('click')
  gameOn = false
  console.log('game ended')
}

// start a new game on button click
const newGame = function () {
  clearGame()
  $('#info').show()
  startGame()
  // if playing in player vs comp mode, set symbols and if comp is X, comp
  // makes first move
  if (playComp) {
    changeSymbol()
    if (comp === 'X') {
      $('.square').off('click')
      setTimeout(function () {
        compDecide()
      }, 500)
    }
  }
}

// check for win
function checkWin (tracked, symbol) {
  for (let i = 0; i < win.length; i++) {
    // iterate through winning combinations and check if the passed array
    // contains a winning combination
    if (
      tracked.includes(win[i][0]) &&
      tracked.includes(win[i][1]) &&
      tracked.includes(win[i][2])
    ) {
      endGame()
      whoWon = symbol
      return (winner = true)
    }
  }
}

// display who's turn it is
const displayTurn = function () {
  const currentPlayer = xTurn ? 'X' : 'O'
  $('#info').text(currentPlayer + '\'s turn!')
}

// display winner in the info element and disable squares if winner is true
const displayWinner = function () {
  if (winner) {
    displays.displayFlashes()
    store.currentGameState.game.over = true

    // increases the wins under a users name
    const adWin = function (x) {
      if (x === 1) {
        wins1++
        $('#1-wins').text(wins1)
      } else if (x === 2) {
        wins2++
        $('#2-wins').text(wins2)
      }
    }

    // if in player vs player mode adds to winners wins
    if (!playComp) {
      const winningPlayer = xTurn ? '2' : '1'
      if (winningPlayer === '1') {
        adWin(1)
      } else {
        adWin(2)
      }
      $('#info').text('Player ' + winningPlayer + ' has won!')
    } else if (playComp) {
      // if in player vs comp mode adds to winners wins
      if (comp === whoWon) {
        $('#info').text('You lost to the computer!')
        adWin(2)
      } else {
        $('#info').text('You beat the computer!')
        adWin(1)
      }
    }
  }
}

// have user and comp switch X and O after each game
const changeSymbol = function () {
  if (player === 'X') {
    $('#player-2-symbol').html('X')
    $('#player-1-symbol').html('O')
    player = 'O'
    comp = 'X'
  } else {
    $('#player-2-symbol').html('O')
    $('#player-1-symbol').html('X')
    player = 'X'
    comp = 'O'
  }
}

// add click event to empty usedSquares
const addClickAgain = function () {
  for (let i = 0; i < 9; i++) {
    const empty = []
    if (!usedSquares.includes(i.toString())) {
      empty.push(i.toString())
    }
    empty.map((x) => {
      $('#' + x).on('click', onSquareClick)
    })
  }
}

/* ---------------  Computer Game Logic ----------------- */

// when turning player vs comp mode on
const compOn = function () {
  $('#on-off').css({'float': 'right', 'background-color': '#00FF00'})
  $('#current-mode').text('Player vs Computer')
  $('#p2').text('Computer')
  playComp = true
}

// when turning player vs comp mode off
const compOff = function () {
  $('#on-off').css({'float': 'left', 'background-color': '#8B1A1A'})
  $('#current-mode').text('Player vs Player')
  $('#p2').text('Player 2')
  $('#player-2-symbol').html('O')
  $('#player-1-symbol').html('X')
  playComp = false
}

// when user clicks change mode
const onCompPlay = function () {
  clearGame()
  $('#info').hide()
  $('#1-wins').text('0')
  $('#2-wins').text('0')
  wins1 = 0
  wins2 = 0
  if (!playComp) {
    compOn()
  } else if (playComp) {
    compOff()
  }
}

// tells computer to choose a random square
function randomChoice () {
  const randomNum = Math.floor(Math.random() * 9).toString()
  if (!usedSquares.includes(randomNum)) {
    compMove(randomNum)
  } else {
    randomChoice()
  }
}

// computer chooses a square
function compMove (squareChoice) {
  if (!moved) {
    $('.square').off('click')
    const squareId = '#' + squareChoice
    // makes the computers move and checks for wins and ties
    if ((comp === 'X' && xTurn) || (comp === 'O' && !xTurn)) {
      comp === 'X' ? $(squareId).text('X') : $(squareId).text('O')
      xTurn === true ? xTrack.push(squareChoice) : oTrack.push(squareChoice)
      $(squareId).off('click')
      usedSquares = xTrack.concat(oTrack)
      checkWin(xTrack, 'X')
      checkWin(oTrack, 'O')
      if (winner === true) {
        displayWinner()
      } else {
        switchTurn()
        displayTurn()
      }
      checkTie()
      moved = true
    }
    if (winner === false) {
      addClickAgain()
    }
  }
}

// computer decides what square to choose
function compDecide () {
  const possibleWin = []
  const possibleLoss = []
  let compTrack
  let playTrack
  player === 'X' ? (playTrack = xTrack) : (playTrack = oTrack)
  comp === 'X' ? (compTrack = xTrack) : (compTrack = oTrack)

  // looks at what squares the player has chosen and determines how the computer can still win
  for (let i = 0; i < win.length; i++) {
    if (
      !playTrack.includes(win[i][0]) &&
      !playTrack.includes(win[i][1]) &&
      !playTrack.includes(win[i][2])
    ) {
      possibleWin.push(win[i])
    }
  }

  // looks at where the computer could possibly lose
  for (let i = 0; i < win.length; i++) {
    if (
      !compTrack.includes(win[i][0]) &&
      !compTrack.includes(win[i][1]) &&
      !compTrack.includes(win[i][2])
    ) {
      possibleLoss.push(win[i])
    }
  }

  // checks if player has taken middle space, if not, takes middle space, else takes a corner space
  if (usedSquares.length === 1 && playTrack.includes('4')) {
    const cornerMove = function () {
      const corners = ['0', '2', '6', '8']
      return corners[Math.floor(Math.random() * 4)]
    }
    compMove(cornerMove())
  } else if (!usedSquares.includes('4')) {
    compMove('4')
  } else {
    // loops through possible wins for a winning move
    for (let i = 0; i < possibleWin.length; i++) {
      if (
        usedSquares.includes(possibleWin[i][0]) &&
        usedSquares.includes(possibleWin[i][1])
      ) {
        compMove(possibleWin[i][2])
      } else if (
        usedSquares.includes(possibleWin[i][0]) &&
        usedSquares.includes(possibleWin[i][2])
      ) {
        compMove(possibleWin[i][1])
      } else if (
        usedSquares.includes(possibleWin[i][2]) &&
        usedSquares.includes(possibleWin[i][1])
      ) {
        compMove(possibleWin[i][0])
      }
    }
    // loops through possible losses to block a potential win by the user
    for (let i = 0; i < possibleLoss.length; i++) {
      if (
        usedSquares.includes(possibleLoss[i][0]) &&
      usedSquares.includes(possibleLoss[i][1])
      ) {
        compMove(possibleLoss[i][2])
      } else if (
        usedSquares.includes(possibleLoss[i][0]) &&
      usedSquares.includes(possibleLoss[i][2])
      ) {
        compMove(possibleLoss[i][1])
      } else if (
        usedSquares.includes(possibleLoss[i][2]) &&
      usedSquares.includes(possibleLoss[i][1])
      ) {
        compMove(possibleLoss[i][0])
      }
    }
    // if there isn't a winning move, and no need to block a win, then this loops through potential wins and chooses a second square in a winning combination
    for (let i = 0; i < possibleWin.length; i++) {
      if (usedSquares.includes(possibleWin[i][0])) {
        compMove(possibleWin[i][1])
      } else if (usedSquares.includes(possibleWin[i][1])) {
        compMove(possibleWin[i][2])
      } else if (usedSquares.includes(possibleWin[i][2])) {
        compMove(possibleWin[i][0])
      }
    }
    // chooses a random square
    if (winner === false && gameOn) {
      randomChoice()
    }
  }
}

// master branch is failing to update game but this branch works fine, so I have to make a change here so I can merge them again.

module.exports = {
  onSignUp,
  onSignIn,
  onSignOut,
  showSignIn,
  showSignUp,
  onChangePassword,
  onCreateGame,
  endGame,
  newGame,
  onUpdateGame,
  onGetGames,
  onCompPlay
}
