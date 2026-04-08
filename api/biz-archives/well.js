const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|15': [
      {
        'id|+1': 1,
        name: '@city()机井',
        photoUrl: '@image("200x200", "#4A90D9", "#FFF", "机井")',
        'wellDepth|20-300': 1,
        'wellType|1': ['灌溉井', '饮水井', '监测井'],
        buildUnit: '@cword(2,4)建设有限公司',
        buildTime: '@date("yyyy-MM-dd")',
        province: '410000',
        city: '410100',
        district: '@pick(["410102","410103","410104","410105"])',
        address: '@county(true)@cword(2,4)路@integer(1,200)号',
        longitude: '@float(112, 114, 6, 6)',
        latitude: '@float(34, 36, 6, 6)',
        'transformerId|+1': 1,
        transformerName: '@city()台区',
        'deviceId|+1': 2000,
        deviceName: '@word(4,8)',
        productKey: /p[a-zA-Z0-9]{5}/,
        deviceKey: /[0-9]{15}/,
        deviceSn: /SN[0-9]{10}/,
        createTime: '@integer(1700000000000, 1743300000000)'
      }
    ]
  },
  queryFilter: {
    fuzzy: 'name,transformerName,deviceName',
    precise: 'district'
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q),
  getDetail: (q) => mySheet.getDetail(q),
  add: (p) => mySheet.add(p),
  update: (p) => mySheet.update(p)
}
