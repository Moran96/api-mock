const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|30': [
      {
        'id|+1': 1,
        uuid: '@guid',
        code: /[0-9A-Fa-f]{64}/,
        mac: /([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})/,
        activatedDays: '@integer(1, 1000)',
        deviceCounts: '@integer(1, 1000)',
        'codeValidDays|+1': '@integer(0, 1)',
        codeCreateTime: '@time(T)',
        codeExpiredTime: '@time(T)'
      }
    ]
  },
  onBeforeAdd: (item) => {
    const now = Date.now()
    const codeValidDays = item.codeValidDays
    item.codeCreateTime = now
    item.codeExpiredTime = now + codeValidDays * 24 * 60 * 60 * 1000
  },
  onBeforeUpdate: () => {}
})

module.exports = {
  add: (p) => mySheet.add(p),
  getList: (q) => mySheet.getList(q)
}
