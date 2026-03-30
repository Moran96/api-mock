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

  // 独立接口
  app.get('/queryInterval', function (req, res) {
    res.json(CommonApi.queryInterval())
  })
}

module.exports = useHttpApis
