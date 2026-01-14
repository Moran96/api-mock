const createMockSheet = require('../../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    'list|2': [
      {
        'id|+1': 1,
        projectName: '@name',
        projectAccount: '@word(8, 20)',
        uuid: '@guid',
        mac: /([0-9A-Fa-f]{2}[-]){5}([0-9A-Fa-f]{2})/,
        lastActiveTime: '@time(T)',
        createTime: '@time(T)'
      }
    ]
  },
  queryFilter: {
    fuzzy: 'projectName'
  },
  onBeforeAdd: (item) => {
    item.createTime = Date.now()
    console.log(item)
  },
  onBeforeUpdate: (item) => {
    item.lastActiveTime = Date.now()
    console.log(item)
  },
  onBeforeUpdate: () => {}
})

module.exports = {
  add: (p) => mySheet.add(p),
  update: (p) => mySheet.update(p),
  getList: (q) => mySheet.getList(q)
}
