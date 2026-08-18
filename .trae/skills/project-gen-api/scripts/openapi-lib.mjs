#!/usr/bin/env node

/**
 * openapi-lib.mjs
 * OpenAPI 解析 / Schema 展开 / 命名推导等共享工具
 * 供 fetch-openapi / analyze-openapi / gen-artifacts 复用
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const SKILL_DIR = path.resolve(__dirname, '..')
export const CACHE_DIR = path.resolve(SKILL_DIR, 'cache')

// ─── 文件系统 ────────────────────────────────────────────────────────────────
export function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

/** 规范化缓存文件路径（始终为归一化后的 JSON） */
export function normalizedPath(name) {
  return path.resolve(CACHE_DIR, `${name}.openapi.json`)
}

/** 读取归一化后的 OpenAPI JSON */
export function loadNormalized(name) {
  const file = normalizedPath(name)
  if (!fs.existsSync(file)) {
    throw new Error(
      `未找到缓存文件: ${file}\n请先运行 fetch-openapi.mjs 拉取远端文档。`
    )
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

// ─── 命名推导 ────────────────────────────────────────────────────────────────
export function camelCase(str) {
  if (!str) return ''
  return String(str)
    .replace(/[{}]/g, '')
    .replace(/[-_/.\s]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
}

const GENERIC = [
  'list',
  'page',
  'get',
  'add',
  'save',
  'update',
  'delete',
  'detail',
  'info',
  'query',
  'create',
  'remove',
  'edit',
  'find'
]
const METHOD_VERB = {
  get: 'get',
  post: 'add',
  put: 'update',
  delete: 'delete',
  patch: 'update'
}

/**
 * 推导前端函数名（作为默认建议，最终由大模型可微调）
 * 优先级：清洗后的 operationId → URL 末段（末段为路径参数或过于通用时，用 method 语义消歧）
 */
export function deriveFunctionName(op) {
  const rawId = op.operationId || ''
  const cleaned = rawId.replace(/Using(GET|POST|PUT|DELETE|PATCH)(_\d+)?$/i, '')
  // operationId 有意义（非空、非单一通用词）时直接采用
  if (cleaned && !GENERIC.includes(cleaned.toLowerCase())) {
    return camelCase(cleaned)
  }

  const rawSegs = (op.path || '').split('/').filter(Boolean)
  const endsWithParam =
    rawSegs.length && rawSegs[rawSegs.length - 1].startsWith('{')
  const segs = rawSegs.filter((s) => !s.startsWith('{'))
  const last = segs[segs.length - 1] || 'request'
  const verb = METHOD_VERB[(op.method || 'get').toLowerCase()] || ''

  // 路径以参数结尾（如 /pet/{id}）或末段通用：加 method 语义前缀消歧
  if (endsWithParam || GENERIC.includes(camelCase(last).toLowerCase())) {
    return camelCase(`${verb}-${last}`)
  }
  return camelCase(last)
}

// ─── 类型映射 ────────────────────────────────────────────────────────────────
export function mapType(schema) {
  if (!schema) return 'object'
  const t = schema.type
  switch (t) {
    case 'integer':
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'array':
      return 'array'
    case 'object':
      return 'object'
    default:
      if (schema.properties) return 'object'
      if (schema.items) return 'array'
      return t || 'object'
  }
}

// ─── $ref 解析 ───────────────────────────────────────────────────────────────
export function resolveRef(schema, root) {
  let cur = schema
  let guard = 0
  while (cur && cur.$ref && guard++ < 20) {
    const refPath = cur.$ref.replace(/^#\//, '').split('/')
    let target = root
    for (const seg of refPath)
      target = target && target[decodeURIComponent(seg)]
    cur = target
  }
  return cur || {}
}

/** 从 $ref 提取 schema 名（用于 DTO/VO 命名） */
export function refName(schema) {
  if (schema && schema.$ref) {
    const parts = schema.$ref.split('/')
    return parts[parts.length - 1]
  }
  return null
}

/** 合并 allOf（springdoc 常见） */
function mergeAllOf(schema, root) {
  if (!schema || !Array.isArray(schema.allOf)) return schema
  const merged = { type: 'object', properties: {}, required: [] }
  for (const part of schema.allOf) {
    const r = resolveRef(part, root)
    if (r.properties) Object.assign(merged.properties, r.properties)
    if (Array.isArray(r.required)) merged.required.push(...r.required)
  }
  return merged
}

/** 提取枚举描述（兼容 Apifox / springdoc 扩展） */
function extractEnumDesc(schema) {
  const ext =
    schema['x-apifox-enum'] ||
    schema['x-enum-varnames'] ||
    schema['x-enum-descriptions']
  if (Array.isArray(ext)) {
    if (typeof ext[0] === 'object') {
      return ext
        .map((e) => `${e.value}-${e.name || e.description || ''}`.trim())
        .join(' ')
    }
    if (Array.isArray(schema.enum) && ext.length === schema.enum.length) {
      return schema.enum.map((v, i) => `${v}-${ext[i]}`).join(' ')
    }
  }
  return undefined
}

/**
 * 生成 Mock.js 模板提示（mockHints），帮助大模型语义化生成 Mock 代码
 * @param {Object} field - 字段定义
 * @returns {Object} mockHints
 */
export function generateMockHints(field) {
  const hints = {}
  const fieldName = field.field.toLowerCase()
  const desc = (field.description || '').toLowerCase()
  const type = field.type

  // 优先根据 field name 和 description 匹配
  const nameDescMatch = (keywords) => {
    for (const kw of keywords) {
      if (fieldName.includes(kw) || desc.includes(kw)) return true
    }
    return false
  }

  if (nameDescMatch(['uuid', 'guid'])) {
    hints.suggestedTemplate = '@guid'
    hints.reason = 'UUID/GUID 格式'
  } else if (nameDescMatch(['email'])) {
    hints.suggestedTemplate = '@email'
    hints.reason = '邮箱格式'
  } else if (nameDescMatch(['phone', 'mobile'])) {
    hints.suggestedTemplate = '@phone'
    hints.reason = '手机号格式'
  } else if (nameDescMatch(['address', 'location'])) {
    hints.suggestedTemplate = '@address'
    hints.reason = '地址格式'
  } else if (nameDescMatch(['image', 'avatar', 'photo', 'pic'])) {
    hints.suggestedTemplate = "@image('120x120', '#894FC4', '#FFF', 'png')"
    hints.reason = '图片格式'
  } else if (nameDescMatch(['time', 'date'])) {
    hints.suggestedTemplate = '@time(T)'
    hints.reason = '时间戳'
  } else if (nameDescMatch(['name', 'title'])) {
    hints.suggestedTemplate = '@name'
    hints.reason = '名称/标题'
  } else if (nameDescMatch(['id']) && type === 'integer') {
    hints.suggestedTemplate = '@integer(1, 100)'
    hints.reason = '数字 ID'
  } else if (type === 'string') {
    hints.suggestedTemplate = '@word(8, 20)'
    hints.reason = '默认字符串'
  } else if (type === 'integer' || type === 'number') {
    hints.suggestedTemplate = '@integer(0, 100)'
    hints.reason = '默认数字'
  } else if (type === 'boolean') {
    hints.suggestedTemplate = '@boolean'
    hints.reason = '布尔值'
  } else if (type === 'array') {
    hints.suggestedTemplate = '[]'
    hints.reason = '数组'
  } else if (type === 'object') {
    hints.suggestedTemplate = '{}'
    hints.reason = '对象'
  }

  return hints
}

/**
 * 将 schema 展开为扁平 fields（对象/数组递归 children）
 * @returns {{ fields: Array, isList: boolean, name: string|null }}
 */
export function schemaToFields(schema, root, seen = new Set()) {
  let s = resolveRef(schema, root)
  s = mergeAllOf(s, root)
  const name = refName(schema) || refName(s)

  // 数组：展开 items
  if (s.type === 'array' || s.items) {
    const inner = schemaToFields(s.items || {}, root, seen)
    return { fields: inner.fields, isList: true, name: inner.name || name }
  }

  const fields = []
  const props = s.properties || {}
  const requiredArr = Array.isArray(s.required) ? s.required : []

  for (const [key, rawProp] of Object.entries(props)) {
    const prop = resolveRef(rawProp, root)
    const merged = mergeAllOf(prop, root)
    const field = {
      field: key,
      type: mapType(merged),
      description: (merged.description || '').trim()
    }
    if (requiredArr.includes(key)) field.required = true
    if (merged.maxLength != null) field.maxLength = merged.maxLength
    if (Array.isArray(merged.enum)) {
      field.enum = merged.enum
      const desc = extractEnumDesc(merged)
      if (desc) field.enumDesc = desc
    }

    // 添加 mockHints
    field.mockHints = generateMockHints(field)

    // 递归嵌套（防循环引用）
    const childRefKey = refName(rawProp) || refName(merged) || key
    if (
      (field.type === 'object' || field.type === 'array') &&
      !seen.has(childRefKey)
    ) {
      const nextSeen = new Set(seen)
      nextSeen.add(childRefKey)
      const child = schemaToFields(rawProp, root, nextSeen)
      if (child.fields.length) field.children = child.fields
      if (child.isList) field.type = 'array'
    }
    fields.push(field)
  }

  return { fields, isList: false, name }
}
