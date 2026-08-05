const express = require('express')
const router = express.Router()
const {
  TARGET_BASE_URL,
  TOKEN,
  COOKIE,
  AUTH_HEADER,
  buildAuthValue
} = require('../proxy')

// 不应透传给目标服务器的请求头
const STRIP_REQUEST_HEADERS = [
  'host',
  'connection',
  'content-length',
  'cookie',
  AUTH_HEADER.toLowerCase()
]

// 不应透传回客户端的响应头
const STRIP_RESPONSE_HEADERS = [
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'connection'
]

function buildTargetUrl(req) {
  // req.originalUrl 形如 /api-proxy/xxx?a=1，去掉挂载前缀后拼接到目标服务器
  const suffix = req.originalUrl.slice(req.baseUrl.length) || '/'
  return TARGET_BASE_URL.replace(/\/$/, '') + suffix
}

function buildForwardHeaders(req) {
  const headers = {}
  for (const [key, value] of Object.entries(req.headers)) {
    if (STRIP_REQUEST_HEADERS.includes(key.toLowerCase())) continue
    headers[key] = value
  }
  headers[AUTH_HEADER] = buildAuthValue(TOKEN)
  // 后端同时从 cookie 的 Authorization 字段读取凭证
  const cookieParts = []
  if (TOKEN) cookieParts.push(`Authorization=${TOKEN}`)
  if (COOKIE) cookieParts.push(COOKIE)
  if (cookieParts.length) headers['Cookie'] = cookieParts.join('; ')
  return headers
}

function buildForwardBody(req) {
  if (['GET', 'HEAD'].includes(req.method)) return undefined
  if (Buffer.isBuffer(req.body)) return req.body
  if (req.is('application/json')) return JSON.stringify(req.body || {})
  if (req.is('application/x-www-form-urlencoded')) {
    return new URLSearchParams(req.body || {}).toString()
  }
  if (typeof req.body === 'string') return req.body
  if (req.body && Object.keys(req.body).length) return JSON.stringify(req.body)
  return undefined
}

router.all('/*', async function (req, res) {
  const targetUrl = buildTargetUrl(req)
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: buildForwardHeaders(req),
      body: buildForwardBody(req)
    })

    response.headers.forEach((value, key) => {
      if (STRIP_RESPONSE_HEADERS.includes(key.toLowerCase())) return
      res.setHeader(key, value)
    })

    const buffer = Buffer.from(await response.arrayBuffer())
    res.status(response.status).send(buffer)
  } catch (err) {
    console.error(`[proxy] ${req.method} ${targetUrl} failed:`, err.message)
    res
      .status(502)
      .json({ code: 502, msg: 'Bad Gateway (proxy error)', error: err.message })
  }
})

module.exports = router
