const a = require('./mock_data.json')

const res = {
  "data": a.time_series_data_predict.slice(0, 115),
  "code": 200,
  "msg": "操作成功"
}

function list () {
  return res
}

const ScreenData = {
  list
}

module.exports = ScreenData