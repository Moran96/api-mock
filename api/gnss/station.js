const Mock = require('mockjs')

function createStationCode() {
  const data = Mock.mock({
    'data|1': /[a-z][A-Z][0-9]{12}/
  })
  return {
    ...data,
    msg: 'success',
    code: 200
  }
}

module.exports = {
  createStationCode
}
