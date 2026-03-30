const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|20': [
      {
        'id|+1': 1,
        avatar: '@image("100x100", "#50B347", "#FFF", "avatar")',
        username: '@cname',
        phone: /1[3-9]\d{9}/,
        totalTransaction: '@float(0, 100000, 2, 2)',
        totalTransactionCount: '@integer(0, 500)',
        totalRecharge: '@float(0, 50000, 2, 2)',
        walletBalance: '@float(0, 10000, 2, 2)'
      }
    ]
  },
  queryFilter: {
    fuzzy: 'username',
    precise: ''
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q),
  getDetail: (q) => mySheet.getDetail(q)
}
