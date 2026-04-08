const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|12': [
      {
        'id|+1': 1,
        name: '@city()台区',
        photoUrl: '@image("200x200", "#50B347", "#FFF", "台区")',
        'capacity|1': [100, 200, 315, 500, 800],
        'meterCount|1-500': 1,
        electricianPhone: /1[3-9]\d{9}/,
        buildTime: '@date("yyyy-MM-dd")',
        province: '410000',
        city: '410100',
        district: '@pick(["410102","410103","410104","410105"])',
        address: '@county(true)@cword(2,4)路@integer(1,200)号',
        longitude: '@float(112, 114, 6, 6)',
        latitude: '@float(34, 36, 6, 6)',
        'deviceId|+1': 1000,
        deviceName: '@word(4,8)',
        productKey: /p[a-zA-Z0-9]{5}/,
        deviceKey: /[0-9]{15}/,
        deviceSn: /SN[0-9]{10}/,
        createTime: '@integer(1700000000000, 1743300000000)'
      }
    ]
  },
  queryFilter: {
    fuzzy: 'name,deviceName',
    precise: 'district'
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q),
  getDetail: (q) => mySheet.getDetail(q),
  add: (p) => mySheet.add(p),
  update: (p) => mySheet.update(p)
}
