let xTurn = true

const onSquareClick = function () {
  const currentSymbol = xTurn ? 'X' : 'O'
  $(this).text(currentSymbol)
  $(this).off('click')
  xTurn ? xTurn = false : xTurn = true
}

module.exports = {
  onSquareClick
}
