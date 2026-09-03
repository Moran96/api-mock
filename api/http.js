const CommonApi = require('./common')

function useHttpApis(app) {
  app.use('/common', require('./routes/common'))
  // app.use('/screen', require('./routes/screen'))
  // app.use('/station', require('./routes/station'))
  // app.use('/receiver', require('./routes/receiver'))
  app.use('/postEngine', require('./routes/postEngine'))
  app.use('/activation', require('./routes/activation'))
  app.use('/gnss/mock', require('./routes/gnssMock'))
  app.use('/biz/customer', require('./routes/customer'))
  app.use('/biz/order', require('./routes/order'))
  app.use('/biz/wallet', require('./routes/wallet'))
  app.use('/archive', require('./routes/archive'))
  app.use('/ems', require('./routes/ems'))
  app.use('/biz-farm', require('./routes/bizFarm'))

  // 代理服务端接口
  app.use('/api-proxy', require('./routes/proxy'))

  // 独立接口
  app.get('/queryInterval', function (req, res) {
    res.json(CommonApi.queryInterval())
  })
}

module.exports = useHttpApis
