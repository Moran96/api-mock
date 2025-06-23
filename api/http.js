const CommonApi = require('./common.js')
const DemoApi = require('./demo.js')

function useHttpApis(app) {
  app.get('/common/get', function (req, res) {
    res.json(DemoApi.getList(req.query))
  })

  app.post('/common/add', function (req, res) {
    res.json(CommonApi.add)
  })
}

module.exports = useHttpApis
