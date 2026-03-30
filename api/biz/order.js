const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|30': [
      {
        'id|+1': 1,
        orderNo: /ORD[0-9]{12}/,
        venue: '@city',
        orderTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
        quantity: '@integer(1, 100)',
        'status|1': ['已完成', '待使用']
      }
    ]
  },
  queryFilter: {
    fuzzy: 'orderNo',
    precise: 'status'
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q),
  getDetail: (q) => mySheet.getDetail(q)
}
