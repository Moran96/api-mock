---
name: 'project-gen-api'
description: '从 OpenAPI/Swagger/Apifox 生成 Mock 服务端代码。Invoke when: 用户提供 Swagger/Apifox 链接，要求生成 Mock 接口数据和路由。'
argument-hint: '[--url <OpenAPI/Swagger/Apifox 链接>] [--module <模块名>] [--tag <分组>]'
---

# 从 OpenAPI 生成 Mock 服务端代码

从两类接口文档源（Apifox LLMs.txt `.md`、Swagger/OpenAPI JSON）生成 Mock 服务端代码：

1. **结构化接口数据（JSON）** `<模块>.api.json` — 脚本生成，包含 `mockHints` 供大模型生成 Mock 代码
2. **接口文档（Markdown）** `<模块>.api.md` — 脚本生成，人类 & 大模型可读
3. **Mock 服务端代码（JS）** — **大模型语义生成**，包含数据层、路由层，并自动挂载

## 设计要点

- **不把整份 OpenAPI 灌进上下文**：先用脚本把远端文档拉到 `cache/` 并归一化为 JSON，再用脚本分析/生成。大模型只读取体积小得多的 `.api.json`。
- **确定性产物用脚本**：`.api.json` 与 `.api.md` 由 `gen-artifacts.mjs` 确定性生成（$ref 解析、枚举、必填、嵌套 children 全部脚本处理），并自动生成 `mockHints` 指导 Mock 模板生成。
- **语义产物保留大模型**：Mock 数据逻辑、路由定义、项目挂载等由大模型基于 `.api.json` 语义生成。

## 执行流程

```
① fetch-openapi.mjs   远端文档 ─▶ cache/<name>.openapi.json（归一化）+ 摘要
        │
        ▼
② analyze-openapi.mjs 列分组/接口（Swagger 大文档按 tag 分组，等用户选择）
        │
        ▼
③ gen-artifacts.mjs   生成 <模块>.api.json + <模块>.api.md（脚本，确定性）
        │
        ▼
④ 大模型             读取 <模块>.api.json ─▶ 语义生成:
                        1. api/<模块>.js (Mock 数据层)
                        2. api/routes/<模块>.js (Mock 路由层)
                        3. 追加挂载代码到 api/http.js
```

---

## Step ①：拉取并归一化远端文档（Script）

```bash
node .trae/skills/project-gen-api/scripts/fetch-openapi.mjs --url "<URL>" [--name <缓存名>] [--force]
```

- 支持 Swagger/OpenAPI **JSON**（含 Swagger 2.0 springfox `/v2/api-docs` 与 OpenAPI 3.0 `/v3/api-docs`）与 Apifox **YAML/.md**（自动识别，含 `yaml` 代码块）
- 产出 `cache/<name>.raw.<ext>`（原始）与 `cache/<name>.openapi.json`（归一化，供后续脚本消费）
- stdout 打印精简摘要：标题、接口总数、各 tag 分组及数量

> `--name` 省略时从 URL 推导（优先 `?group=` 参数）。`cache/` 已被 `.gitignore` 忽略。

## Step ②：分析分组（Script，Swagger 大文档必做）

```bash
# 列出全部分组及接口数
node .trae/skills/project-gen-api/scripts/analyze-openapi.mjs --name <name>

# 查看某分组下的接口明细（method / path / summary / 建议函数名）
node .trae/skills/project-gen-api/scripts/analyze-openapi.mjs --name <name> --tag "<tag名>"
```

**Swagger 大文档场景**：分组多时，**先展示分组列表并等待用户选择**，不要自动全量生成。逐个/按需处理，处理完询问是否继续下一个。

**Apifox / 单接口场景**：接口少可直接进入 Step ③。

## Step ③：生成结构化数据 + 接口文档（Script）

```bash
node .trae/skills/project-gen-api/scripts/gen-artifacts.mjs --name <name> --module <模块> [--tag "<tag>"] [--base <基础模块>] [--spec <spec名>] [--outDir <目录>]
```

| 参数       | 说明                                                                 |
| ---------- | -------------------------------------------------------------------- |
| `--module` | 模块名（Apifox 场景）/ 子模块名（Swagger 场景，通常取 tag 语义名）   |
| `--tag`    | 仅处理该 tag 下接口（Swagger 分组场景）                              |
| `--base`   | 基础模块名（Swagger 场景），产物落到 `api/<base>/<module>/`          |
| `--spec`   | 提供则 json/md 落到 `.kiro/specs/<spec>/...`（Mock JS 始终在 `api`） |
| `--outDir` | 显式指定 json/md 输出目录（覆盖上述推导）                            |

**默认产物路径**：

| 模式          | 结构化数据 & 文档                             | Mock 代码（大模型生成）                         |
| ------------- | --------------------------------------------- | ----------------------------------------------- |
| Apifox / 普通 | `api/<模块>/<模块>.api.json` `.api.md`        | `api/<模块>.js` + `api/routes/<模块>.js`        |
| Swagger 分组  | `api/<base>/<模块>/<模块>.api.json` `.api.md` | `api/<base>/<模块>.js` + `api/routes/<模块>.js` |
| Spec 模式     | `.kiro/specs/<spec>/.../<模块>.api.*`         | `api/.../<模块>.js` + `api/routes/<模块>.js`    |

脚本会打印接口清单与 Mock 代码目标路径，作为 Step ④ 输入。

## Step ④：大模型语义生成 Mock 服务端代码（Trae）

读取上一步的 `<模块>.api.json`（包含 `mockHints`），根据接口类型分两种策略生成 Mock 代码：

### 策略 A：CRUD 类接口（List/Add/Update/Delete）→ MockSheet 模式

如果 `.api.json` 中包含 `isList: true` 的响应接口（通常是列表查询），自动使用 `MockSheet` 模式。

**生成 1：Mock 数据层 (`api/<模块>.js`)**

```javascript
const createMockSheet = require('../utils/MockSheet')

const mySheet = createMockSheet({
  mockContent: {
    // 使用 mockHints.suggestedTemplate 生成 Mock.js 模板
    'list|20': [
      {
        'id|+1': 1,
        '<field1>': '<mockHints.suggestedTemplate>'
        // ...其他字段
      }
    ]
  },
  queryFilter: {
    // 根据接口参数 description 选择模糊搜索字段
    fuzzy: '<最可能搜索的字段>'
  }
})

module.exports = {
  getList: (q) => mySheet.getList(q),
  add: (p) => mySheet.add(p),
  update: (p) => mySheet.update(p),
  remove: (q) => mySheet.remove(q) // 如果存在删除接口
}
```

**生成 2：Mock 路由层 (`api/routes/<模块>.js`)**

```javascript
const express = require('express')
const router = express.Router()
const <ModuleName>Api = require('../<模块路径>') // 自动引入

// 列表接口
router.get('/list', function (req, res) {
  res.json(<ModuleName>Api.getList(req.query))
})
// 新增接口
router.post('/save', function (req, res) {
  res.json(<ModuleName>Api.add(req.body))
})
// 更新接口
router.post('/update', function (req, res) {
  res.json(<ModuleName>Api.update(req.body))
})
// 删除接口 (如果存在)
router.delete('/delete', function (req, res) {
  res.json(<ModuleName>Api.remove(req.query))
})

module.exports = router
```

**生成 3：自动挂载 (`api/http.js`)**

在 `useHttpApis` 函数中追加：

```javascript
app.use('/<路由前缀>', require('./routes/<模块>'))
```

### 策略 B：特殊逻辑类接口（图表/统计/导出）→ 自定义 Mock 模式

如果接口不是标准的 CRUD 模式（例如 Dashboard 数据、图表统计），则生成自定义的 Mock 逻辑。

**生成 1：Mock 数据层 (`api/<模块>.js`)**

```javascript
const Mock = require('mockjs')

function <函数名>(req) {
  // 根据 .api.json 的 mockHints 生成自定义逻辑
  const data = Mock.mock({
    // 使用 mockHints.suggestedTemplate
  })
  return {
    code: 200,
    msg: 'success',
    data: data
  }
}

module.exports = { <函数名> }
```

**生成 2：Mock 路由层 & 挂载**（同上）

### 决策流程

1. **判断接口类型**：检查 `.api.json` 中是否存在 `isList: true` 的接口
2. **分流执行**：
   - 是 → 策略 A (MockSheet)
   - 否 → 策略 B (自定义 Mock)
3. **生成产物**：
   - `api/<模块>.js` - Mock 数据逻辑
   - `api/routes/<模块>.js` - Express Router
   - 修改 `api/http.js` - 追加挂载代码

**追加逻辑**：若目标 `.js` 已存在，询问用户追加到已有文件还是新建。

---

## `.api.json` 结构（脚本产出，供参考）

```json
{
  "module": "<模块名>",
  "apis": [
    {
      "name": "<函数名>",
      "summary": "<接口中文名>",
      "method": "GET|POST|PUT|DELETE",
      "url": "<接口路径>",
      "params": [
        {
          "field": "fieldName",
          "type": "number|string|boolean",
          "required": true,
          "description": "说明",
          "default": "默认值",
          "enum": ["V1"]
        }
      ],
      "body": {
        "name": "DtoName",
        "fields": [
          {
            "field": "fieldName",
            "type": "string",
            "required": true,
            "description": "说明",
            "maxLength": 20,
            "enum": ["V1"],
            "enumDesc": "V1-含义",
            "mockHints": {
              "suggestedTemplate": "@word(8, 20)",
              "reason": "默认字符串"
            }
          }
        ]
      },
      "response": {
        "name": "VoName",
        "isList": true,
        "fields": [
          {
            "field": "fieldName",
            "type": "object",
            "description": "说明",
            "children": [],
            "mockHints": {
              "suggestedTemplate": "{}",
              "reason": "对象"
            }
          }
        ]
      }
    }
  ]
}
```

- `params` Query/Path 参数；`body` Request Body；无则省略该字段
- `body.name` / `response.name` 来自后端 DTO/VO（$ref schema 名）
- `response.isList` 响应 `data` 是否为数组；`children` 递归表达嵌套对象
- 通用返回体 `{code,msg,data}` 自动取 `data` 作为 `response`
- `mockHints` 脚本自动生成的 Mock.js 模板建议

## 文件结构

```
.trae/skills/project-gen-api/
├── SKILL.md
├── scripts/
│   ├── openapi-lib.mjs        # 共享：$ref 解析 / schema 展开 / 命名推导
│   ├── fetch-openapi.mjs      # ① 拉取 + 归一化到 cache
│   ├── analyze-openapi.mjs    # ② 分组/接口分析
│   └── gen-artifacts.mjs      # ③ 生成 .api.json + .api.md
├── cache/                     # 归一化文档缓存（已 gitignore）
└── reports/                   # 预留（已 gitignore）
```

## 注意事项

- `.api.json` 仅作 AI 上下文参考与 Mock 代码生成输入，不参与编译运行
- Mock 代码（数据层 + 路由层）生成在 `api/` 下，路由挂载在 `api/http.js`
- Swagger 大文档**按 tag 分批**，每个 tag 独立目录，处理完询问是否继续
- 缓存可能过期，重新执行 `fetch-openapi.mjs --force` 刷新
- 依赖项目已安装的 `yaml` 包（用于解析 Apifox YAML/.md），脚本从项目根 `node_modules` 解析
