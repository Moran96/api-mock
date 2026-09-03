const createMockSheet = require('../../utils/MockSheet')

// Task1 电价数据源
const mySheet = createMockSheet({
  mockContent: {
    'list|18': [
      {
        'id|+1': 1,
        // 数据源名称
        'sourceName|1': ['ENTSO-E', 'AEMO', 'Amber', 'Tibber', 'Nord Pool', 'EPEX SPOT'],
        // 类型 WHOLESALE(批发)/RETAIL(零售)
        'sourceType|1': ['WHOLESALE', 'RETAIL'],
        // 覆盖国家/区域
        'areas|1-3': ['@pick(["DE/NL","EU 9 国","澳洲 NEM","DE","NL","FR","ES"])'],
        // 当前状态 ACTIVE(在线)/DELAYED(刷新延迟)/OFFLINE(离线失败)/DISABLE(已停用)
        'status|1': ['ACTIVE', 'DELAYED', 'OFFLINE', 'DISABLE'],
        // 最后成功刷新时间
        lastSuccessAt: '@integer(1700000000000, 1743300000000)',
        // 受影响电站数
        'counts|0-500': 1
      }
    ]
  },
  queryFilter: {
    fuzzy: 'sourceName',
    precise: 'sourceType,status'
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q)
}
