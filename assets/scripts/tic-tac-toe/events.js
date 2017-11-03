
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
    $('#info').text('It\'s a tie!')
  }
}

// display who's turn it is
const displayTurn = function () {
  const currentPlayer = xTurn ? 'X' : 'O'
  $('#info').text(currentPlayer + '\'s turn!')
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

startGame()

// clear gameboard and reset game
const clearGame = function () {
  endGame()
  squares.map((x) => $('#' + x).text(''))
  startGame()
}

// start a new game on button click
$('#newGame').on('click', clearGame)

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
      endGame()
      return (winner = true)
    }
  }
}

// display winner in the info element and disable squares
const displayWinner = function () {
  if (winner) {
    const winningPlayer = xTurn ? 'Player 2' : 'Player 1'
    $('#info').text(winningPlayer + ' has won!')
  }
}

module.exports = {
  checkTie,
  switchTurn,
  trackMove,
  onSquareClick,
  startGame,
  clearGame,
  endGame,
  checkWin
}
