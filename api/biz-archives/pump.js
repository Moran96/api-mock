const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|10': [
      {
        'id|+1': 1,
        name: '@city()水泵',
        photoUrl: '@image("200x200", "#D94A4A", "#FFF", "水泵")',
        'flowRate|10-500': 1,
        manufacturer: '@cword(2,4)泵业有限公司',
        model: /QJ[0-9]{2}-[0-9]{2}\/[0-9]{1,2}/,
        buildTime: '@date("yyyy-MM-dd")',
        province: '410000',
        city: '410100',
        district: '@pick(["410102","410103","410104","410105"])',
        address: '@county(true)@cword(2,4)路@integer(1,200)号',
        longitude: '@float(112, 114, 6, 6)',
        latitude: '@float(34, 36, 6, 6)',
        'wellId|+1': 1,
        wellName: '@city()机井',
        createTime: '@integer(1700000000000, 1743300000000)'
      }
    ]
  },
  queryFilter: {
    fuzzy: 'name,wellName',
    precise: 'district'
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q),
  getDetail: (q) => mySheet.getDetail(q),
  add: (p) => mySheet.add(p),
  update: (p) => mySheet.update(p)
}
