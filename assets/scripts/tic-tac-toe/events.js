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
  let currentSymbol = xTurn ? 'X' : 'O'
  $(this).text(currentSymbol)
  $(this).off('click')
  trackMove(this)
  switchTurn()
  checkWin(xTrack)
  checkWin(oTrack)
}

// add onClick event to all squares
squares.map((x) => $('#' + x).on('click', onSquareClick))

// check for win
function checkWin (tracked) {
  for (let i = 0; i < win.length; i++) {
    if (
      tracked.includes(win[i][0]) &&
      tracked.includes(win[i][1]) &&
      tracked.includes(win[i][2])
    ) {
      return (winner = true);
    }
  }
}

module.exports = {
  onSquareClick
}
