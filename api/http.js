const CommonApi = require('./common.js')
const DemoApi = require('./demo.js')

const StationApi = require('./gnss/station')
const ReceiverApi = require('./gnss/receiver')
const EngineApi = require('./gnss/engine')
const PostDataApi = require('./gnss/postData')
const ProjectsApi = require('./gnss/projects')
const CodesApi = require('./gnss/codes')
const KeyApi = require('./gnss/key')
const DashboardApi = require('./gnss/dashboard')

const CGS = require('./configuration/index')

function useHttpApis(app) {
  app.get('/common/get', function (req, res) {
    res.json(DemoApi.getList(req.query))
  })

  app.get('/common/getDetail', function (req, res) {
    res.json(DemoApi.getDetail(req.query))
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

  // Station
  app.get('/station/getDetail', function (req, res) {
    res.json(DemoApi.getDetail(req.query))
  })

  app.post('/station', function (req, res) {
    res.json(StationApi.createStationCode())
  })

  // getListForSelect
  app.get('/station/list', function (req, res) {
    res.json(DemoApi.getListForSelect(req.query))
  })

  // Receiver
  app.get('/receiver/getList', function (req, res) {
    res.json(ReceiverApi.getList(req.query))
  })

  app.post('/receiver/add', function (req, res) {
    res.json(ReceiverApi.add(req.body))
  })

  app.post('/receiver/update', function (req, res) {
    res.json(ReceiverApi.update(req.body))
  })

  app.delete('/receiver/remove', function (req, res) {
    res.json(ReceiverApi.remove(req.query))
  })

  // EngineApi
  app.get('/postEngine/list', function (req, res) {
    res.json(EngineApi.getList(req.query))
  })
  app.get('/postEngine/detail', function (req, res) {
    res.json(EngineApi.getDetail(req.query))
  })
  app.post('/postEngine/save', function (req, res) {
    res.json(EngineApi.add(req.body))
  })
  app.put('/postEngine/update', function (req, res) {
    res.json(EngineApi.update(req.body))
  })
  app.get('/postEngine/data', function (req, res) {
    res.json(PostDataApi.getList(req.query))
  })
  // activation api
  app.get('/activation/project/list', function (req, res) {
    res.json(ProjectsApi.getList(req.query))
  })
  app.post('/activation/project/save', function (req, res) {
    res.json(ProjectsApi.add(req.body))
  })
  app.post('/activation/project/update', function (req, res) {
    res.json(ProjectsApi.update(req.body))
  })
  app.get('/activation/code/list', function (req, res) {
    res.json(CodesApi.getList(req.query))
  })
  app.post('/activation/code/save', function (req, res) {
    res.json(CodesApi.add(req.body))
  })
  // Key
  app.get('/activation/getPubKey', function (req, res) {
    res.json(KeyApi.getPublicKey(req.query))
  })
  app.post('/activation/refreshPublicKey', function (req, res) {
    res.json(KeyApi.refreshPublicKey(req.body))
  })
  app.get('/activation/checkPlatformActivated', function (req, res) {
    res.json(KeyApi.checkPlatformActivated(req.query))
  })
  app.get('/activation/getServerInfo', function (req, res) {
    res.json(KeyApi.getServerInfo(req.query))
  })
  app.post('/activation/activate', function (req, res) {
    res.json(KeyApi.activate(req.body))
  })
  app.get('/activation/getPlatformActivationInfo', function (req, res) {
    res.json(KeyApi.getPlatformActivationInfo(req.query))
  })
  // DashboardApi
  app.get('/gnss/mock/line', function (req, res) {
    res.json(DashboardApi.getCurve())
  })
  app.get('/gnss/mock/pie', function (req, res) {
    res.json(DashboardApi.getPie())
  })
  app.get('/gnss/mock/overview', function (req, res) {
    res.json(DashboardApi.getOverview(req))
  })
  // getStationInfo
  app.get('/gnss/mock/getStationInfo', function (req, res) {
    res.json(DashboardApi.getStationInfo())
  })
}

module.exports = useHttpApis
