// const sqrs = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
const colors = ['#FFFF00', '#FF0000', '#FF6600', '#00FF00', '#00FFFF', '#0033FF', '#FF00FF', '#FF0099', '#6E0DD0', '#00EE00']

const winFlash = function () {
  const randomSquare = function () {
    return Math.floor(Math.random() * 9)
  }
  const currSq = '#' + randomSquare()
  const currCol = colors[randomSquare()]
  $(currSq).css('background-color', currCol)
  setTimeout(function () {
    $(currSq).css('background-color', 'transparent')
  }, 300)
}

const displayFlashes = function () {
  let timer = 33
  for (let i = 0; i < 50; i++) {
    setTimeout(function () {
      winFlash()
    }, timer)
    timer = timer + 33
  }
$('.square').css('background-color', 'none')
}

module.exports = {
  winFlash,
  displayFlashes
}
