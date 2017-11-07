const getFormFields = require(`../../../lib/get-form-fields`)
const api = require('./api')
const ui = require('./ui')
const store = require('../store.js')
const displays = require('./displays')

/* ------------------- SET UP ------------------- */

// hide game container and sign in/sign up forms
$('.game-container').hide()
$('#side-title-div').hide()
$('#form-sign-in').hide()
$('#form-sign-up').hide()

/* ---------------- API SIGN IN/SIGN OUT ------------------- */

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

// on join game
const onJoin = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  api.joinGame(data)
    .then(ui.joinGameSuccess)
    .catch(ui.joinGameFailure)
}

/* ------------------- API GAME HANDLERS ------------------- */

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

/* ------------------- GAME LOGIC ------------------- */

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
let moved
let gameOn = false
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
  // const used = xTrack.concat(oTrack)
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

// add symbols to board and disable click function
const onSquareClick = function () {
  if (playComp) {
    if (player === 'X') {
      $(this).text('X')
      store.currentGameState.game.cell.value = 'X'
    } else {
      $(this).text('O')
      store.currentGameState.game.cell.value = 'O'
    }
  } else {
    const currentLetter = xTurn ? 'X' : 'O'
    $(this).text(currentLetter)
    store.currentGameState.game.cell.value = currentLetter
  }
  $(this).off('click')
  store.currentGameState.game.cell.index = this.id
  trackMove(this)
  checkWin(xTrack)
  checkWin(oTrack)
  usedSquares = xTrack.concat(oTrack)
  switchTurn()
  displayTurn()
  displayWinner()
  checkTie()
  onUpdateGame()
  if (store.currentGame.player_o !== null) {
    setInterval(onGetGame, 1000)
    boardUpdate()
  }
  moved = false
  if (!winner && playComp && gameOn) {
    setTimeout(function () {
      compDecide()
    }, 1000)
  }
}

// add click event to all squares
const startGame = function () {
  gameOn = true
  xTurn = true
  winner = false
  xTrack = []
  oTrack = []
  usedSquares = []
  moved = false
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
  gameOn = false
  store.game = false
}

// start a new game on button click
$('#new-game').on('click', function () {
  clearGame()
  $('#info').show()
  startGame()
  if (playComp) {
    if (comp === 'X') {
      setTimeout(function () {
        compDecide()
      }, 500)
    }
  }
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
    displays.displayFlashes()
    store.currentGameState.game.over = true
    if (!playComp) {
      const winningPlayer = xTurn ? '2' : '1'
      if (winningPlayer === '1') {
        $('#1-wins').text(wins1 + 1)
        wins1++
      } else {
        $('#2-wins').text(wins2 + 1)
        wins2++
      }
      $('#info').text('Player ' + winningPlayer + ' has won!')
    } else if (playComp) {
      if ((comp === 'X' && xTurn) || (comp === 'O' && !xTurn)) {
        $('#info').text('You lost to the computer!')
        $('#2-wins').text(wins2 + 1)
        wins2++
      } else {
        $('#info').text('You beat the computer!')
        $('#1-wins').text(wins1 + 1)
        wins1++
      }
    }
  }
}

/* ------------------- Computer Game Logic ------------------- */

// on comp play click
const onCompPlay = function () {
  if (!playComp) {
    $('#on-off').css({'float': 'right', 'background-color': '#00FF00'})
    $('#current-mode').text('Player vs Computer')
    $('#p2').text('Computer')
    whoGoesFirst()
    playComp = true
  } else if (playComp) {
    $('#on-off').css({'float': 'left', 'background-color': '#8B1A1A'})
    $('#current-mode').text('Player vs Player')
    $('#p2').text('Player')
    $('#player-2-symbol').html('O')
    $('#player-1-symbol').html('X')
    playComp = false
  }
}

// determines if computer or user is X - x always goes first
const whoGoesFirst = function () {
  const x = Math.floor(1 + Math.random() * 2)
  if (x === 2) {
    $('#player-2-symbol').html('X')
    $('#player-1-symbol').html('O')
    player = 'O'
    comp = 'X'
  } else {
    player = 'X'
    comp = 'O'
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
    const squareId = '#' + squareChoice
    if ((comp === 'X' && xTurn) || (comp === 'O' && !xTurn)) {
      comp === 'X' ? $(squareId).text('X') : $(squareId).text('O')
      xTurn === true ? xTrack.push(squareChoice) : oTrack.push(squareChoice)
      $(squareId).off('click')
      usedSquares = xTrack.concat(oTrack)
      checkWin(xTrack)
      checkWin(oTrack)
      if (winner === true) {
        displayWinner()
      } else {
        switchTurn()
        displayTurn()
      }
      checkTie()
      moved = true
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

    for (let i = 0; i < possibleWin.length; i++) {
      if (usedSquares.includes(possibleWin[i][0])) {
        compMove(possibleWin[i][1])
      } else if (usedSquares.includes(possibleWin[i][1])) {
        compMove(possibleWin[i][2])
      } else if (usedSquares.includes(possibleWin[i][2])) {
        compMove(possibleWin[i][0])
      }
    }

    for (let i = 0; i < possibleLoss.length; i++) {
      if (usedSquares.includes(possibleLoss[i][0])) {
        compMove(possibleLoss[i][1])
      } else if (usedSquares.includes(possibleLoss[i][1])) {
        compMove(possibleLoss[i][2])
      } else if (usedSquares.includes(possibleLoss[i][2])) {
        compMove(possibleLoss[i][0])
      }
    }

    if (winner === false && gameOn) {
      randomChoice()
    }
  }
}

/* ------------- Join Game Logic ------------------- */

// const onGetGames = function (event) {
//   event.preventDefault()
//   api.getGames()
//     .then(ui.getGamesSuccess)
//     .catch(ui.getGamesFailure)
// }

const updateBoard = function (arr) {
  arr.map((x, i) => {
    $('#' + i).text(x)
  })
}

const setUpJoinedGame = function () {
  updateBoard(store.currentGame.cells)
  setPlayers()

  const currentX = []
  const currentO = []
  for (let i = 0; i < store.currentGame.cells.length; i++) {
    if (store.currentGame.cells[i] === 'X') {
      currentX.push(store.currentGame.cells[i])
    } else if (store.currentGame.cells[i] === 'O') {
      currentO.push(store.currentGame.cells[i])
    }
  }
  if (currentX.length > currentO.length) {
    xTurn = false
  } else {
    xTurn = true
  }

  if (user === 'player X' && !xTurn) {
    console.log('not X turn')
  } else if (user === 'player X' && xTurn) {
    console.log('x turn')
  } else if (user === 'player O' && xTurn) {
    console.log('not o turn')
  } else if (user === 'player O' && !xTurn) {
    console.log('o turn')
  }
}

const boardUpdate = setInterval(setUpJoinedGame, 1000)
let user

const assignClicks = function () {
  console.log('clicks should start now')
  startGame()
  if (store.game.player_o !== null) {
    setInterval(onGetGame, 1000)
    boardUpdate()
  }
}

$('#close-joined').on('click', assignClicks)

const onGetGame = function () {
  api.getGame()
    .then(ui.getGameSuccess)
    .catch(getGameFail)
}

const getGameFail = function () {
  console.log('ya failed buddy')
}

const setPlayers = function () {
  if (store.game.player_x.email === store.user.email) {
    user = 'player X'
  } else {
    user = 'player O'
  }
}

$('#temp-game-update').on('click', onGetGame)
$('#temp-button').on('click', setUpJoinedGame)

// get game
// get game again every second
// check to see if it matches current gamestate
// if not, change turns and let player go

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
  onGetGames,
  onCompPlay,
  onJoin,
  onGetGame
}
