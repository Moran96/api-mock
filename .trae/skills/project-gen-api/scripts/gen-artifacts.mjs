#!/usr/bin/env node

/**
 * gen-artifacts.mjs
 * 从本地缓存的归一化 OpenAPI JSON，用脚本确定性地生成两件套：
 *   - <模块>.api.json  结构化接口数据（供 table/form 生成 & 大模型语义生成 JS 消费）
 *   - <模块>.api.md    接口文档（人类 & 大模型可读）
 * 第三件套（前端 API JS）不在此生成，交由大模型基于 .api.json 语义化生成。
 *
 * 用法:
 *   node gen-artifacts.mjs --name <name> --module <module> [--tag "<tag>"] \
 *        [--base <baseModule>] [--spec <specName>] [--outDir <dir>]
 *
 *   --name    缓存名（fetch-openapi 产出）
 *   --module  模块名（LLMs.txt 场景）/ 子模块名（Swagger 场景，通常等于 tag 语义名）
 *   --tag     仅处理该 tag 下的接口（Swagger 大文档分组场景）
 *   --base    基础模块名（Swagger 场景，产物落到 src/api/<base>/<module>/）
 *   --spec    spec 名；提供则 json/md 落到 .kiro/specs/<spec>/... （API JS 仍在 src/api）
 *   --outDir  显式指定 json/md 输出目录（覆盖上述推导）
 */

import fs from 'fs'
import path from 'path'
import {
  loadNormalized,
  deriveFunctionName,
  mapType,
  resolveRef,
  refName,
  schemaToFields,
  ensureDir
} from './openapi-lib.mjs'

const PROJECT_ROOT = process.cwd()

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = { name: null, module: null, tag: null, base: null, spec: null, outDir: null }
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--name':
        opts.name = args[++i]
        break
      case '--module':
        opts.module = args[++i]
        break
      case '--tag':
        opts.tag = args[++i]
        break
      case '--base':
        opts.base = args[++i]
        break
      case '--spec':
        opts.spec = args[++i]
        break
      case '--outDir':
        opts.outDir = args[++i]
        break
    }
  }
  return opts
}

// ─── 参数展开（兼容 OpenAPI 3.0 与 Swagger 2.0）───────────────────────────────
function buildParams(op, doc, pathLevelParams) {
  const all = [...(pathLevelParams || []), ...(op.parameters || [])]
  const params = []
  for (const raw of all) {
    const p = raw.$ref ? resolveRef(raw, doc) : raw
    if (!p || (p.in !== 'query' && p.in !== 'path' && p.in !== 'formData')) continue
    // OpenAPI 3.0 参数类型在 p.schema，Swagger 2.0 直接在 p 上
    const schema = p.schema || p
    const item = {
      field: p.name,
      type: mapType(schema),
      required: !!p.required || p.in === 'path',
      description: (p.description || schema.description || '').trim()
    }
    if (schema.default != null) item.default = schema.default
    if (Array.isArray(schema.enum)) item.enum = schema.enum
    params.push(item)
  }
  return params
}

// ─── Request Body 展开（兼容 OpenAPI 3.0 requestBody 与 Swagger 2.0 in:body）───
function buildBody(op, doc) {
  let schema = null
  if (op.requestBody) {
    const rb = op.requestBody.$ref ? resolveRef(op.requestBody, doc) : op.requestBody
    const content = rb.content || {}
    const media =
      content['application/json'] || content['application/x-www-form-urlencoded'] || Object.values(content)[0]
    if (media && media.schema) schema = media.schema
  } else {
    // Swagger 2.0：body 是 in:body 的 parameter
    const bodyParam = (op.parameters || []).find(p => p.in === 'body')
    if (bodyParam && bodyParam.schema) schema = bodyParam.schema
  }
  if (!schema) return null
  const { fields, name, isList } = schemaToFields(schema, doc)
  if (!fields.length) return null
  const body = { name: name || 'RequestBody', fields }
  if (isList) body.isList = true
  return body
}

// ─── 响应 data 展开（兼容 OpenAPI 3.0 content 与 Swagger 2.0 schema）──────────
function buildResponse(op, doc) {
  const responses = op.responses || {}
  const ok = responses['200'] || responses['201'] || responses.default
  if (!ok) return null
  const okObj = ok.$ref ? resolveRef(ok, doc) : ok
  let rawSchema = null
  if (okObj.content) {
    const media = okObj.content['application/json'] || okObj.content['*/*'] || Object.values(okObj.content)[0]
    if (media && media.schema) rawSchema = media.schema
  } else if (okObj.schema) {
    rawSchema = okObj.schema // Swagger 2.0
  }
  if (!rawSchema) return null

  const schema = resolveRef(rawSchema, doc)
  const envelopeName = refName(rawSchema) || refName(schema)
  // 通用返回体 { code, msg, data } → 取 data 作为 response
  if (schema.properties && schema.properties.data) {
    const dataSchema = schema.properties.data
    const { fields, name, isList } = schemaToFields(dataSchema, doc)
    const resp = { name: name || envelopeName || 'Data', fields }
    if (isList) resp.isList = true
    return resp
  }
  const { fields, name, isList } = schemaToFields(rawSchema, doc)
  const resp = { name: name || envelopeName || 'ResponseVO', fields }
  if (isList) resp.isList = true
  return resp
}

// ─── 单接口结构化 ────────────────────────────────────────────────────────────
function buildApi(p, method, op, doc, pathLevelParams) {
  const api = {
    name: deriveFunctionName({ ...op, path: p, method }),
    summary: op.summary || op.description || '',
    method: method.toUpperCase(),
    url: p
  }
  const params = buildParams(op, doc, pathLevelParams)
  if (params.length) api.params = params
  const body = buildBody(op, doc)
  if (body && body.fields.length) api.body = body
  const response = buildResponse(op, doc)
  if (response) api.response = response
  return api
}

function collectApis(doc, tag) {
  const apis = []
  for (const [p, item] of Object.entries(doc.paths || {})) {
    const pathLevelParams = item.parameters
    for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
      const op = item[method]
      if (!op) continue
      const tags = op.tags && op.tags.length ? op.tags : ['未分组']
      if (tag && tags[0] !== tag) continue
      apis.push(buildApi(p, method, op, doc, pathLevelParams))
    }
  }
  return apis
}

// ─── Markdown 生成 ───────────────────────────────────────────────────────────
function renderParamRows(params) {
  if (!params || !params.length) return '（无）\n'
  let md = '| 参数 | 类型 | 必填 | 说明 |\n|------|------|------|------|\n'
  for (const p of params) {
    const desc = [
      p.description,
      p.enum ? `枚举: ${p.enum.join('/')}` : '',
      p.default != null ? `默认: ${p.default}` : ''
    ]
      .filter(Boolean)
      .join('；')
    md += `| ${p.field} | ${p.type} | ${p.required ? '是' : '否'} | ${desc || '-'} |\n`
  }
  return md
}

function renderFieldRows(fields, prefix = '') {
  let md = ''
  let nested = ''
  md += '| 字段 | 类型 | 说明 |\n|------|------|------|\n'
  for (const f of fields || []) {
    const desc = [f.description, f.enum ? `枚举: ${f.enum.join('/')}` : '', f.enumDesc || ''].filter(Boolean).join('；')
    md += `| ${prefix}${f.field} | ${f.type} | ${desc || '-'} |\n`
    if (f.children && f.children.length) {
      nested += `\n**${prefix}${f.field}** 子字段：\n\n` + renderFieldRows(f.children, '')
    }
  }
  return md + nested
}

function renderMarkdown(module, apis) {
  let md = `# ${module} 接口文档\n\n> 本文件由 gen-artifacts.mjs 自动生成，请勿手改。\n`
  apis.forEach((api, i) => {
    md += `\n## ${i + 1}. ${api.summary || api.name}\n\n`
    md += `- 方法：\`${api.name}(${api.body ? 'data' : 'params'})\`\n`
    md += `- 请求：\`${api.method} ${api.url}\`\n`
    if (api.params) {
      md += `- 请求参数（query / path）：\n\n` + renderParamRows(api.params) + '\n'
    }
    if (api.body) {
      md +=
        `- 请求体（\`${api.body.name}\`${api.body.isList ? '[]' : ''}）：\n\n` + renderFieldRows(api.body.fields) + '\n'
    }
    if (api.response) {
      md +=
        `- 响应 \`data\`：\`${api.response.name}\`${api.response.isList ? '[]' : ''}\n\n` +
        renderFieldRows(api.response.fields) +
        '\n'
    }
  })
  return md
}

// ─── 输出路径推导 ────────────────────────────────────────────────────────────
function resolveOutDir(opts) {
  if (opts.outDir) return path.resolve(PROJECT_ROOT, opts.outDir)
  const sub = opts.base ? path.join(opts.base, opts.module) : opts.module
  if (opts.spec) return path.resolve(PROJECT_ROOT, '.kiro/specs', opts.spec, sub)
  return path.resolve(PROJECT_ROOT, 'src/api', sub)
}

function apiJsTargetDir(opts) {
  const sub = opts.base ? path.join(opts.base, opts.module) : opts.module
  return path.resolve(PROJECT_ROOT, 'src/api', sub)
}

function main() {
  const opts = parseArgs()
  if (!opts.name || !opts.module) {
    console.error(
      '用法: node gen-artifacts.mjs --name <name> --module <module> [--tag "<tag>"] [--base <base>] [--spec <spec>] [--outDir <dir>]'
    )
    process.exit(1)
  }

  const doc = loadNormalized(opts.name)
  const apis = collectApis(doc, opts.tag)
  if (!apis.length) {
    console.error(`[gen-artifacts] 未找到接口${opts.tag ? `（tag=${opts.tag}）` : ''}`)
    process.exit(1)
  }

  const structured = { module: opts.module, apis }
  const outDir = resolveOutDir(opts)
  ensureDir(outDir)

  const jsonFile = path.join(outDir, `${opts.module}.api.json`)
  const mdFile = path.join(outDir, `${opts.module}.api.md`)
  fs.writeFileSync(jsonFile, JSON.stringify(structured, null, 2), 'utf-8')
  fs.writeFileSync(mdFile, renderMarkdown(opts.module, apis), 'utf-8')

  const rel = f => path.relative(PROJECT_ROOT, f)
  console.log(`[gen-artifacts] 结构化数据: ${rel(jsonFile)}`)
  console.log(`[gen-artifacts] 接口文档  : ${rel(mdFile)}`)
  console.log(`[gen-artifacts] 接口数量  : ${apis.length}`)
  console.log('\n接口清单:')
  apis.forEach((a, i) => console.log(`  ${i + 1}. ${a.name}  [${a.method}] ${a.url}  ${a.summary || ''}`))

  console.log('\n下一步（大模型语义生成第三件套 API JS）:')
  console.log(`  目标文件: ${rel(path.join(apiJsTargetDir(opts), opts.module + '.js'))}`)
  console.log(`  依据: 读取 ${rel(jsonFile)}，按项目 src/api 规范 + JSDoc 生成 export function。`)
}

try {
  main()
} catch (e) {
  console.error(`[gen-artifacts] 错误: ${e.message}`)
  process.exit(1)
}
