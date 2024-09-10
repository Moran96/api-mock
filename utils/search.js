/**
 * 数据列表分页
 * @param {Array} list 数据列表
 * @param {Object} options 分页项
 * @param {string | number} options.page 页码
 * @param {string | number} options.step 步长
 * @returns {Array} 分页后的数据列表
 */
function pagination (list, options) {
  const {
    page,
    step
  } = options

  const pageNum = page ? Number(page) : 1
  const pageSize = step ? Number(step) : 10

  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return list.slice(start, end)
}

/**
 * 查询过滤
 * @param {Array} list 数据列表
 * @param {Object} query 查询对象
 * @param {string} precise 精准查询过滤字段字符串 用逗号分隔
 * @param {string} fuzzy 模糊查询过滤字段字符串 用逗号分隔
 * @returns 
 */
function filterSearch (list, query, precise, fuzzy) {
  if (!query) return list

  if (!precise && !fuzzy) return list

  const preciseCodes = precise.split(',')
  const fuzzyCodes = fuzzy.split(',')

  return list.filter(row => {
    let matched = true

    // 精准过滤
    matched = matched && _preciseMatch(preciseCodes, matched, query, row)

    // 模糊过滤
    matched = matched && _fuzzyMatch(fuzzyCodes, matched, query, row)

    return matched
  })
}

// 精准匹配
function _preciseMatch (preciseCodes, state, query, row) {
  let currentState = state
  preciseCodes.forEach(pCode => {
    if (!query[pCode]) {
      currentState = currentState && true
    } else {
      const valSource = row[pCode]
      const valQuery = query[pCode]
      currentState = currentState && valSource === valQuery
    }
  })
  return currentState
}

// 模糊匹配
function _fuzzyMatch (fuzzyCodes, state, query, row) {
  let currentState = state
  fuzzyCodes.forEach(fCode => {
    if (!query[fCode]) {
      currentState = currentState && true
    } else {
      const valSource = row[fCode].trim().toUpperCase()
      const valQuery = query[fCode].trim().toUpperCase()
      currentState = currentState && valSource.indexOf(valQuery) > -1
    }
  })
  return currentState
}

module.exports = {
  pagination,
  filterSearch
}
