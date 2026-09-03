const createMockSheet = require('../../utils/MockSheet')

// Task2 竞价区映射表
const mySheet = createMockSheet({
  mockContent: {
    list: [
      { id: 1, biddingZone: 'DE-LU', eicCode: '10Y1001A1001A82H', area: '德国/卢森堡', sourceName: 'ENTSO-E' },
      { id: 2, biddingZone: 'NL', eicCode: '10YNL----------L', area: '荷兰', sourceName: 'ENTSO-E' },
      { id: 3, biddingZone: 'BE', eicCode: '10YBE----------2', area: '比利时', sourceName: 'ENTSO-E' },
      { id: 4, biddingZone: 'FR', eicCode: '10YFR-RTE------C', area: '法国', sourceName: 'ENTSO-E' },
      { id: 5, biddingZone: 'ES', eicCode: '10YES-REE------0', area: '西班牙', sourceName: 'ENTSO-E' },
      { id: 6, biddingZone: 'IE-SEM', eicCode: '10Y1001A1001A59C', area: '爱尔兰', sourceName: 'ENTSO-E' },
      { id: 7, biddingZone: 'LT', eicCode: '10YLT-1001A0008Q', area: '立陶宛', sourceName: 'Nord Pool' },
      { id: 8, biddingZone: 'HU', eicCode: '10YHU-MAVIR----U', area: '匈牙利', sourceName: 'ENTSO-E' },
      { id: 9, biddingZone: 'RO', eicCode: '10YRO-TEL------P', area: '罗马尼亚', sourceName: 'ENTSO-E' },
      { id: 10, biddingZone: 'AU-NSW', eicCode: 'AEMO-NSW1', area: '澳大利亚(新南威尔士)', sourceName: 'AEMO' }
    ]
  },
  queryFilter: {
    fuzzy: 'biddingZone,area,sourceName',
    precise: ''
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q)
}
