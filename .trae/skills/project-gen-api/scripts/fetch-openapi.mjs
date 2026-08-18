#!/usr/bin/env node

/**
 * fetch-openapi.mjs
 * 将远端 OpenAPI 文档（Swagger JSON / Apifox LLMs.txt .md）拉取到本地 cache/ 目录，
 * 归一化为 JSON 后落盘，避免把整份大文档塞进大模型上下文。
 *
 * 用法:
 *   node fetch-openapi.mjs --url <URL>                 # 拉取并归一化
 *   node fetch-openapi.mjs --url <URL> --name device   # 指定缓存名
 *   node fetch-openapi.mjs --url <URL> --force         # 忽略已有缓存重新拉取
 *
 * 输出:
 *   cache/<name>.raw.<ext>        # 原始内容
 *   cache/<name>.openapi.json     # 归一化后的 OpenAPI JSON（供后续脚本消费）
 *   stdout                        # 精简摘要（title / 版本 / tags 及接口数 / 总接口数）
 */

import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import { CACHE_DIR, ensureDir, normalizedPath } from './openapi-lib.mjs'

const parseYaml = yaml.parse

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = { url: null, name: null, force: false }
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
        opts.url = args[++i]
        break
      case '--name':
        opts.name = args[++i]
        break
      case '--force':
        opts.force = true
        break
    }
  }
  return opts
}

/** 从 URL 推导默认缓存名 */
function deriveName(url) {
  try {
    const u = new URL(url)
    const group = u.searchParams.get('group')
    if (group) return group.toLowerCase()
    const last = u.pathname.split('/').filter(Boolean).pop() || 'openapi'
    return (
      last.replace(/\.(md|json|ya?ml)$/i, '').replace(/[^a-zA-Z0-9_-]/g, '-') ||
      'openapi'
    )
  } catch {
    return 'openapi'
  }
}

/** 将原始文本解析为 OpenAPI 对象（JSON 优先，回退 YAML） */
function toOpenApi(text) {
  const trimmed = text.trimStart()
  // JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return { doc: JSON.parse(text), ext: 'json' }
    } catch {
      /* fallthrough */
    }
  }
  // Apifox .md 可能是纯 YAML，或含 ```yaml 代码块的 markdown
  const fence = text.match(/```(?:ya?ml|json)?\s*\n([\s\S]*?)```/i)
  const body = fence ? fence[1] : text
  try {
    const doc = parseYaml(body)
    if (doc && typeof doc === 'object')
      return { doc, ext: fence ? 'md' : 'yaml' }
  } catch (e) {
    throw new Error(`无法解析为 OpenAPI（既非 JSON 也非 YAML）: ${e.message}`)
  }
  throw new Error('内容解析结果为空，非有效 OpenAPI 文档')
}

function summarize(doc) {
  const info = doc.info || {}
  const paths = doc.paths || {}
  const tagCount = {}
  let total = 0
  for (const [, item] of Object.entries(paths)) {
    for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
      const op = item[method]
      if (!op) continue
      total++
      const tags = op.tags && op.tags.length ? op.tags : ['未分组']
      const tag = tags[0]
      tagCount[tag] = (tagCount[tag] || 0) + 1
    }
  }
  return {
    title: info.title || '',
    version: info.version || '',
    total,
    tagCount
  }
}

async function main() {
  const opts = parseArgs()
  if (!opts.url) {
    console.error(
      '用法: node fetch-openapi.mjs --url <URL> [--name <name>] [--force]'
    )
    process.exit(1)
  }

  const name = opts.name || deriveName(opts.url)
  ensureDir(CACHE_DIR)

  const outJson = normalizedPath(name)
  if (fs.existsSync(outJson) && !opts.force) {
    const doc = JSON.parse(fs.readFileSync(outJson, 'utf-8'))
    console.log(`[fetch-openapi] 已存在缓存（--force 可强制刷新）: ${outJson}`)
    printSummary(name, doc)
    return
  }

  console.log(`[fetch-openapi] 拉取: ${opts.url}`)
  const res = await fetch(opts.url, {
    headers: { Accept: 'application/json, text/yaml, text/markdown, */*' }
  })
  if (!res.ok) throw new Error(`请求失败 HTTP ${res.status}`)
  const text = await res.text()

  const { doc, ext } = toOpenApi(text)

  const rawFile = path.resolve(CACHE_DIR, `${name}.raw.${ext}`)
  fs.writeFileSync(rawFile, text, 'utf-8')
  fs.writeFileSync(outJson, JSON.stringify(doc, null, 2), 'utf-8')

  console.log(`[fetch-openapi] 原始内容: ${rawFile}`)
  console.log(`[fetch-openapi] 归一化 JSON: ${outJson}`)
  printSummary(name, doc)
}

function printSummary(name, doc) {
  const s = summarize(doc)
  const tags = Object.entries(s.tagCount).sort((a, b) => b[1] - a[1])
  console.log('\n──────── OpenAPI 摘要 ────────')
  console.log(`缓存名   : ${name}`)
  console.log(`标题     : ${s.title} ${s.version ? '(' + s.version + ')' : ''}`)
  console.log(`接口总数 : ${s.total}`)
  console.log(`分组数   : ${tags.length}`)
  console.log('分组明细 :')
  tags.forEach(([tag, cnt], i) =>
    console.log(`  ${i + 1}. ${tag} (${cnt}个接口)`)
  )
  console.log('──────────────────────────────')
  console.log('\n下一步:')
  console.log(
    `  分析某分组: node .trae/skills/project-gen-api/scripts/analyze-openapi.mjs --name ${name} --tag "<tag名>"`
  )
  console.log(
    `  生成三件套: node .trae/skills/project-gen-api/scripts/gen-artifacts.mjs --name ${name} --module <模块> [--tag "<tag名>"]`
  )
}

main().catch((e) => {
  console.error(`[fetch-openapi] 错误: ${e.message}`)
  process.exit(1)
})
