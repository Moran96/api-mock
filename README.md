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

## 依赖项
- express: Web 框架
- express-ws: WebSocket 支持
- cors: 跨域资源共享
- mockjs: 模拟数据生成
- nodemon: 开发时自动重启

## 用途
本项目的主要用途是为 GNSS 相关的前端应用提供完整的 API Mock 服务，让前端开发可以在没有后端的情况下独立进行开发和测试。
