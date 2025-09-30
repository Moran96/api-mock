const CommonApi = require('./common.js')
const DemoApi = require('./demo.js')

const CGS = require('./configuration/index')

function useHttpApis(app) {
  app.get('/common/get', function (req, res) {
    res.json(DemoApi.getList(req.query))
  })

  app.get('/common/getNoPage', function (req, res) {
    res.json(DemoApi.getListNoPage())
  })

  app.post('/common/add', function (req, res) {
    res.json(CommonApi.add)
  })

  app.post('/common/update', function (req, res) {
    res.json(CommonApi.update)
  })

  app.delete('/common/remove', function (req, res) {
    res.json(DemoApi.remove(req.query))
  })

  app.get('/screen/deviceLocationList', function (req, res) {
    res.json(CGS.location.getList())
  })

  app.get('/queryInterval', function (req, res) {
    res.json(CommonApi.queryInterval())
  })
}

module.exports = useHttpApis
