// src/app/api/narratives/route.ts
import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
import { promises as fs } from 'fs'
import path from 'path'

type Narrative = { question: string; text: string; completed_at?: string }

async function fileExists(p: string) {
  try { await fs.access(p); return true } catch { return false }
}

function parseCSVStrict(text: string): string[][] {
  const rows: string[][] = []
  let cur: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1]
        if (next === '"') { field += '"'; i++ } else { inQuotes = false }
      } else { field += ch }
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === ',') { cur.push(field); field = '' }
      else if (ch === '\n') { cur.push(field); rows.push(cur); cur = []; field = '' }
      else if (ch === '\r') { /* ignore */ }
      else field += ch
    }
  }
  cur.push(field)
  rows.push(cur)
  return rows
}

export async function GET() {
  try {
    const docsDir = path.join(process.cwd(), 'docs')
    if (await fileExists(docsDir)) {
      const files = await fs.readdir(docsDir)
      const vaFiles = files.filter((f) => /^videoask-text-entries.*\.csv$/i.test(f))
      const narrativeFiles = files.filter((f) => /^ghac-narrative-responses.*\.csv$/i.test(f))
      const sources: { name: string; table: string[][] }[] = []
      for (const f of [...narrativeFiles, ...vaFiles]) {
        const raw = await fs.readFile(path.join(docsDir, f), 'utf8')
        sources.push({ name: `docs/${f}`, table: parseCSVStrict(raw) })
      }

      const out: Narrative[] = []

      for (const src of sources) {
        const table = src.table
        if (!table.length) continue
        const header = table[0]
        const rows = table.slice(1)

        // Parse VideoAsk exports: prefer the first Q*. column that is not URLs/Duration
        if (/videoask-text-entries/i.test(src.name)) {
          let qIdx = header.findIndex((h) => /^q\d+\./i.test(h) && !/urls|duration/i.test(h))
          if (qIdx < 0) qIdx = header.findIndex((h) => /\[text answer\]|\[transcribed\]/i.test(h))
          const dtIdx = header.findIndex((h) => /date\/?time/i.test(h))
          const qHeader = header[qIdx] || 'VideoAsk Response'
          const question = (qHeader || '').replace(/\s*\(.+$/, '').trim()
          for (const r of rows) {
            const raw = (r[qIdx] || '').trim()
            if (!raw) continue
            const text = raw.replace(/^\[(Text Answer|Transcribed)\]\s*/i, '')
            if (text.replace(/\s+/g, ' ').length < 160) continue // keep large paragraph style
            if (/^(acknowledged|skipped|start)$/i.test(text)) continue
            out.push({ question, text, completed_at: r[dtIdx] })
          }
          continue
        }

        // Parse narrative responses CSV format
        if (/ghac-narrative-responses/i.test(src.name)) {
          const rows = table.slice(1) // Skip header
          for (const r of rows) {
            // Column 0: How Arts Affect Your Life, Column 1: If You Could Change One Thing
            const artsAffectText = (r[0] || '').trim()
            const changeOneThingText = (r[1] || '').trim()
            
            if (artsAffectText && artsAffectText.length > 20) {
              out.push({ 
                question: "How have the arts touched your life personally?", 
                text: artsAffectText.replace(/^\[.*?\]\s*/, '').replace(/^"(.*)"$/, '$1')
              })
            }
            
            if (changeOneThingText && changeOneThingText.length > 20) {
              out.push({ 
                question: "What would you transform about arts organizations in Greater Hartford?", 
                text: changeOneThingText.replace(/^\[.*?\]\s*/, '').replace(/^"(.*)"$/, '$1')
              })
            }
          }
          continue
        }
      }

      // Sort and limit - prioritize new narrative responses
      out.sort((a, b) => {
        // Prioritize narrative responses from new CSV
        const aIsNew = a.question.includes("How have the arts touched") || a.question.includes("transform")
        const bIsNew = b.question.includes("How have the arts touched") || b.question.includes("transform")
        
        if (aIsNew && !bIsNew) return -1
        if (!aIsNew && bIsNew) return 1
        
        // Secondary sort by date
        const ta = a.completed_at ? Date.parse(a.completed_at) : 0
        const tb = b.completed_at ? Date.parse(b.completed_at) : 0
        return tb - ta
      })

      return NextResponse.json({ ok: true, narratives: out.slice(0, 400) })
    }
  } catch {}
  return NextResponse.json({ ok: true, narratives: [] })
}
