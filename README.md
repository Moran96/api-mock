# Api Mock

本项目是一个 API Mock 服务，主要用于模拟后端 API 响应，支持前端开发和测试。

## 主要功能

### HTTP API Mock 服务

- 基于 Express.js 框架构建
- 支持常见的 CRUD 操作（GET、POST、PUT、DELETE）
- 使用 Mock.js 生成模拟数据

### 主要业务模块

#### GNSS（全球导航卫星系统）相关 API

- **Station（基站管理）**: 创建、查询基站信息
- **Receiver（接收机管理）**: 接收机的增删改查
- **Engine（后处理引擎）**: 引擎列表、详情、数据查询
- **PostData（后处理数据）**: 数据列表查询
- **Projects（项目管理）**: 项目列表、保存、更新
- **Codes（激活码管理）**: 激活码列表、保存
- **Key（密钥管理）**: 公钥获取、刷新、平台激活、激活信息查询
- **Dashboard（仪表盘）**: 曲线图、饼图、概览数据、基站信息

#### 通用 API（Common/Demo）

- 列表查询（支持分页、搜索）
- 详情查询
- 增删改操作
- 无分页列表查询

#### CGS（配置管理）

- 设备位置列表查询

#### Screen（大屏展示）

- 设备位置列表

#### 其他模块

- AI 聊天（aiChat）
- 设备（device）
- 支付（payment）
- 电动车（scooter）
- 商店（shop）

### WebSocket 服务

- 支持 WebSocket 连接（路径：`/socket/test`）
- 消息接收与回显（延迟 100ms）

### 技术特点

- 使用 `mockjs` 生成各种类型的模拟数据（随机字符串、数字、日期等）
- 支持分页和搜索过滤
- 支持 CORS 跨域
- 静态文件服务（`/static` 路径）
- 开发模式下使用 nodemon 热重载

## 项目结构

```
api-mock/
├── api/              # API 定义目录
│   ├── gnss/         # GNSS 相关 API
│   ├── http.js       # HTTP 接口统一管理
│   ├── websocket.js  # WebSocket 接口
│   └── ...           # 其他业务模块
├── utils/            # 工具函数（MockSheet、搜索等）
├── public/           # 静态资源
└── index.js          # 服务入口
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
npm run dev
```

服务将在 `http://localhost:8000/` 启动。

### 启动命令

```bash
npm run dev
```

使用 nodemon 监听文件变化并自动重启。

## 代理服务端接口

除 Mock 外，本项目还提供一个代理转发功能：将本地请求自动带上写死的凭证后，转发到真实服务器。适用于真实接口需要登录鉴权、但前端不方便直接携带凭证的场景。

### 工作方式

- 挂载路径前缀：`/api-proxy`
- 访问 `http://localhost:8000/api-proxy/<path>?<query>` 会转发到 `<目标服务器>/<path>?<query>`
- 自动注入凭证：请求头 `Authorization: <token>`，同时注入 `Cookie: Authorization=<token>`（后端会从 cookie 读取）
- 支持全部方法（GET/POST/PUT/DELETE 等），透传 query、请求体与响应

### 配置

凭证通过 `.env` 读取（首次使用请复制 `.env.example` 为 `.env`）：

```bash
# 访问凭证（必填）
PROXY_TOKEN=你的token

# 会话 Cookie（可选，后端若需额外 cookie 时填写）
PROXY_COOKIE=

# 转发目标服务器（可选，默认 https://fat-gnss-api.iotomp.com）
PROXY_TARGET_BASE_URL=https://fat-gnss-api.iotomp.com
```

> `.env` 已加入 `.gitignore`，不会提交到仓库。

### 使用示例

```bash
# 转发到 https://fat-gnss-api.iotomp.com/v2/system/card/listCurCard
curl http://localhost:8000/api-proxy/v2/system/card/listCurCard
```

### 更新 token

nodemon 已配置监听 `.env`（见 `nodemon.json`）。修改 `.env` 中的 `PROXY_TOKEN` 并保存后，服务会自动重启并加载新凭证，无需手动重启。

> 提示：token 通常有有效期，返回 `{"code":403,"msg":"Session timed out..."}` 时说明凭证已过期，重新登录真实系统获取新 token 更新到 `.env` 即可。

## 依赖项

- express: Web 框架
- express-ws: WebSocket 支持
- cors: 跨域资源共享
- mockjs: 模拟数据生成
- nodemon: 开发时自动重启
- dotenv: 从 `.env` 读取环境变量

## 用途

本项目的主要用途是为 GNSS 相关的前端应用提供完整的 API Mock 服务，让前端开发可以在没有后端的情况下独立进行开发和测试。
