const list = require('./deviceLocation.json')

function getList() {
  return {
    msg: 'success',
    code: 200,
    data: list
  }
}

module.exports = {
  getList
}
