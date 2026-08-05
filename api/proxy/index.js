// 代理服务端接口配置

// 真实服务器地址（转发目标），可用环境变量覆盖
const TARGET_BASE_URL =
  process.env.PROXY_TARGET_BASE_URL || 'https://fat-gnss-api.iotomp.com'

// 访问凭证，从环境变量读取
const TOKEN = process.env.PROXY_TOKEN || ''

// 会话 Cookie，从环境变量读取（后端除请求头外还会读取 cookie 鉴权）
const COOKIE = process.env.PROXY_COOKIE || ''

// 凭证注入的请求头名称与格式（Authorization: <token>）
const AUTH_HEADER = 'Authorization'
function buildAuthValue(token) {
  return token
}

module.exports = {
  TARGET_BASE_URL,
  TOKEN,
  COOKIE,
  AUTH_HEADER,
  buildAuthValue
}
