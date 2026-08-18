#!/usr/bin/env node

/**
 * analyze-openapi.mjs
 * 读取本地缓存的归一化 OpenAPI JSON，输出分组 / 接口清单，
 * 供 Swagger 大文档「按 tag 分组、等待用户选择」时使用。
 * 只输出精简结构，不把整份文档灌入上下文。
 *
 * 用法:
 *   node analyze-openapi.mjs --name <name>                 # 列出全部分组及数量
 *   node analyze-openapi.mjs --name <name> --tag "客户管理"  # 列出指定分组的接口明细
 *   node analyze-openapi.mjs --name <name> --json          # 以 JSON 输出（便于程序消费）
 */

import { loadNormalized, deriveFunctionName } from './openapi-lib.mjs'

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = { name: null, tag: null, json: false }
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--name':
        opts.name = args[++i]
        break
      case '--tag':
        opts.tag = args[++i]
        break
      case '--json':
        opts.json = true
        break
    }
  }
  return opts
}

/** 遍历 paths，展开为操作列表 */
function collectOps(doc) {
  const ops = []
  for (const [p, item] of Object.entries(doc.paths || {})) {
    for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
      const op = item[method]
      if (!op) continue
      const tags = op.tags && op.tags.length ? op.tags : ['未分组']
      ops.push({
        tag: tags[0],
        method: method.toUpperCase(),
        path: p,
        summary: op.summary || op.description || '',
        operationId: op.operationId || '',
        fnName: deriveFunctionName({ ...op, path: p, method })
      })
    }
  }
  return ops
}

function main() {
  const opts = parseArgs()
  if (!opts.name) {
    console.error('用法: node analyze-openapi.mjs --name <name> [--tag "<tag>"] [--json]')
    process.exit(1)
  }

  const doc = loadNormalized(opts.name)
  let ops = collectOps(doc)
  if (opts.tag) ops = ops.filter(o => o.tag === opts.tag)

  if (opts.json) {
    console.log(JSON.stringify(ops, null, 2))
    return
  }

  if (opts.tag) {
    console.log(`分组「${opts.tag}」共 ${ops.length} 个接口:\n`)
    ops.forEach((o, i) => {
      console.log(`  ${i + 1}. [${o.method}] ${o.path}`)
      console.log(`     名称: ${o.summary || '(无)'}`)
      console.log(`     建议函数名: ${o.fnName}`)
    })
  } else {
    const byTag = {}
    for (const o of ops) (byTag[o.tag] = byTag[o.tag] || []).push(o)
    const tags = Object.entries(byTag).sort((a, b) => b[1].length - a[1].length)
    console.log(`检测到以下接口分组（共 ${tags.length} 个）:\n`)
    tags.forEach(([tag, list], i) => console.log(`  ${i + 1}. ${tag} (${list.length}个接口)`))
    console.log('\n请选择要处理的分组（序号 / tag 名），再运行 gen-artifacts.mjs 生成三件套。')
  }
}

try {
  main()
} catch (e) {
  console.error(`[analyze-openapi] 错误: ${e.message}`)
  process.exit(1)
}
