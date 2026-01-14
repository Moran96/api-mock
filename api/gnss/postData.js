const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|20': [
      {
        'id|+1': 1,
        'engineId|+1': 1,
        engineName: '@name',
        'statioinId|+1': 1,
        stationName: '@name',
        x: '@float(0, 180, 2, 2)',
        y: '@float(0, 90, 2, 2)',
        z: '@float(0, 90, 2, 2)',
        dx: '@float(0, 180, 2, 2)',
        dy: '@float(0, 90, 2, 2)',
        dz: '@float(0, 90, 2, 2)',
        baseLength: '@float(0, 180, 2, 2)',
        'calcStatus|+1': [0, 1], // 0:失败 1:成功
        calcTime: '@time(T)'
      }
    ]
  },
  queryFilter: {
    fuzzy: 'stationName,engineName',
    precise: 'calcStatus'
  },
  onBeforeFilter: (query) => {
    query.calcStatus = parseInt(query.calcStatus)
  },
  onBeforeAdd: (item) => {
    console.log(item)
  },
  onBeforeUpdate: (item) => {
    console.log(item)
  },
  onBeforeUpdate: () => {}
})

module.exports = {
  getList: (q) => mySheet.getList(q)
}
