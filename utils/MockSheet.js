const { pagination, filterSearch } = require('./search')

const Mock = require('mockjs')

class MockSheet {
  /**
   * 构造函数
   * @param {Object} config 配置项
   * @param {any} config.mockContent mock生成参数
   * @Param {}
   */
  constructor(config) {
    const dataMap = Mock.mock(config.mockContent)
    this.list = dataMap.list
    this.queryFilter = config.queryFilter || {}

    this.hooks = {
      onBeforeFilter: config.onBeforeFilter,
      onBeforeAdd: config.onBeforeAdd,
      onBeforeUpdate: config.onBeforeUpdate
    }
  }

  getList(params) {
    const { list, queryFilter } = this
    let query = params

    if (this.hooks.onBeforeFilter) {
      this.hooks.onBeforeFilter(query)
    }

    // 查询
    const filtered = filterSearch(
      list,
      query,
      queryFilter.precise,
      queryFilter.fuzzy
    )

    // 分页
    const paged = pagination(filtered, {
      page: query.pageNum,
      step: query.pageSize
    })

    return this.exportStandardJson(
      {
        msg: 'success',
        code: 200,
        rows: paged,
        total: filtered.length
      },
      false
    )
  }

  getDetail(query) {
    const target = this.list.find((item) => item.id === parseInt(query.id))
    const res = {
      msg: 'success',
      code: 200,
      data: target
    }
    return res
  }

  add(params) {
    const { list, hooks } = this
    const newRecord = {
      ...params,
      id: this._createId(),
      createTime: Date.now()
    }
    if (hooks.onBeforeAdd) {
      hooks.onBeforeAdd(newRecord)
    }
    list.unshift(newRecord)
    return this.exportStandardJson({
      data: null
    })
  }

  update(params) {
    const { list, hooks } = this

    const target = list.find((item) => item.id === params.id)

    const targetUpdate = JSON.parse(JSON.stringify(params))

    if (hooks.onBeforeUpdate) {
      hooks.onBeforeUpdate(targetUpdate)
    }

    Object.assign(target, targetUpdate)

    const res = {
      msg: 'success',
      code: 200,
      data: null
    }
    return res
  }

  _createId() {
    const max = this.list.reduce((max, item) => Math.max(max, item.id), 0)
    return max + 1
  }

  exportStandardJson(obj, isInner = true) {
    let content = {
      msg: 'success',
      code: 200
    }
    if (isInner) {
      return { ...content, data: obj }
    } else {
      return Object.assign(content, obj)
    }
  }
}

function createMockSheet(config, e) {
  return new MockSheet(config)
}

module.exports = createMockSheet
