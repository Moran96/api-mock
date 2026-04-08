const { pagination, filterSearch } = require('../../utils/search')
const Mock = require('mockjs')

const typeConfig = {
  CONSUME: { amountRange: [-5000, -1], status: 'PAID' },
  REFUND: { amountRange: [-5000, -1], status: 'REFUND_SUCCESS' },
  RECHARGE: { amountRange: [1, 10000], status: 'PAID' }
}
const types = Object.keys(typeConfig)

const list = Array.from({ length: 40 }, (_, i) => {
  const type = types[Mock.mock('@integer(0, 2)')]
  const { amountRange, status } = typeConfig[type]
  return {
    id: i + 1,
    type,
    amount: Mock.mock(`@float(${amountRange[0]}, ${amountRange[1]}, 2, 2)`),
    status,
    time: Mock.mock('@integer(1700000000000, 1743300000000)')
  }
})

function getList(query) {
  const filtered = filterSearch(list, query, 'type', '')
  const paged = pagination(filtered, {
    page: query.pageNum,
    step: query.pageSize
  })
  return {
    msg: 'success',
    code: 200,
    rows: paged,
    total: filtered.length
  }
}

module.exports = { getList }
