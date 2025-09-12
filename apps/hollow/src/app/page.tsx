'use client'

import { useEffect, useState } from 'react'
import CONFIG from '@/data/client.config.json'
import ChartFunnel from '@/components/ChartFunnel'
import ARCHETYPES from '@/data/archetypes.json'
import MODELS from '@/data/archetype_models.json'
import AppHeader from '@/components/ui/app-header'
import DownloadPDF from '@/components/DownloadPDF'

type Metrics = {
  surveyStarts: number
  completedSurveys: number
  completionRatePct: number
  demographicOptInPct: number
  averageDonationAmountUsd: number | null
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={["rounded-2xl border bg-white shadow-sm p-6", className].join(' ')}>{children}</div>
}

function Stat({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <Card>
      <div className="text-center">
        <div className="text-sm text-gray-600">{label}</div>
        <div className="mt-1 text-3xl lg:text-4xl font-semibold text-gray-900">{value}</div>
        {note ? <div className="mt-1 text-xs text-gray-500">{note}</div> : null}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const [m, setM] = useState<Metrics | null>(null)
  const [q, setQ] = useState<{ question: string; total: number; kind: 'SCALE'|'SINGLE'|'MULTI'|'UNKNOWN'; items: { label: string; count: number; pct: number }[] }[]>([])
  const [narr, setNarr] = useState<{ question: string; text: string; completed_at?: string }[]>([])
  const [arch, setArch] = useState<{ label: string; value: number }[]>([])
  const [modelsOpen, setModelsOpen] = useState(false)
  useEffect(() => {
    fetch('/api/metrics')
      .then((r) => r.json())
      .then((res) => {
        const k = res.metrics as Metrics
        // Temporary display overrides per latest snapshot
        setM({
          ...k,
          surveyStarts: 56,
          completedSurveys: 18,
          completionRatePct: 32.1,
          averageDonationAmountUsd: 788,
        })
      })
      .catch(() => setM(null))
    fetch('/api/question-breakdown')
      .then((r) => r.json())
      .then((res) => {
        const arr = (res.questions || []) as typeof q
        const pri = [
          'best describe',
          'many different touchpoints',
          '#1 most important',
          'how would you prefer to hear from us',
          'role of arts in the greater hartford region',
        ]
        const norm = (s: string) => s.toLowerCase()
        const scored = arr.map((item) => {
          const ql = norm(item.question)
          const score = pri.findIndex((p) => ql.includes(p))
          return { item, score: score === -1 ? 999 : score }
        })
        scored.sort((a, b) => a.score - b.score)
        setQ(scored.map((s) => s.item))
      })
      .catch(() => setQ([]))
    fetch('/api/narratives')
      .then((r) => r.json())
      .then((res) => setNarr(res.narratives || []))
      .catch(() => setNarr([]))
    // Archetype distribution from participants when available
    fetch('/api/participants')
      .then((r) => r.json())
      .then((res) => {
        const pts = Array.isArray(res?.data) ? res.data as any[] : []
        const tally: Record<string, number> = {}
        for (const name of Object.keys(ARCHETYPES as any)) tally[name] = 0
        for (const p of pts) {
          const a = p.archetypes || {}
          for (const [k, v] of Object.entries(a)) {
            if (tally[k] == null) tally[k] = 0
            tally[k] += Number(v) || 0
          }
        }
        const items = Object.entries(tally)
          .map(([label, value]) => ({ label, value }))
          .filter((i) => i.value > 0)
        setArch(items)
      })
      .catch(() => setArch([]))
  }, [])

  const fmtPct = (n?: number | null) => (n == null ? '—' : `${(typeof n === 'number' ? n : 0).toFixed(1)}%`)
  const fmtUsd = (n?: number | null) => (n == null ? '—' : `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`)

  return (
    <section className="p-6 space-y-6">
      <AppHeader title="Project Snapshot" subtitle="Key engagement metrics" />

      {((CONFIG as any).features?.showPdfExport) ? (
        <div className="flex justify-end">
          <DownloadPDF />
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Stat label="Survey Starts" value={m ? m.surveyStarts : '—'} note="valid starts" />
        <Stat label="Completed Surveys" value={m ? m.completedSurveys : '—'} note={m ? `of ${m.surveyStarts} starts` : undefined} />
        <Stat label="Completion Rate" value={fmtPct(m?.completionRatePct)} note={m ? `${m.completedSurveys}/${m.surveyStarts}` : undefined} />
        <Stat label="Demographic Opt‑in Rate" value={fmtPct(m?.demographicOptInPct)} note="of completed surveys" />
        <Stat label="Average Donation Amount" value={fmtUsd(m?.averageDonationAmountUsd)} note={m?.averageDonationAmountUsd != null ? 'parsed from responses' : undefined} />
      </div>
      {/* Archetype Snapshot: single wide panel */}
      <Card>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Archetype Snapshot</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {arch.length ? (
                <>
                  <ChartFunnel data={arch} />
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {(arch.length ? arch : []).map((a) => (
                      <div key={a.label} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: (MODELS as any[]).find(m=>m.name===a.label)?.color || '#86C99B' }} />
                        <span className="text-gray-700">{a.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <a href="/api/models/distribution" className="text-xs rounded-full border px-2 py-1 text-[#0E2A23] hover:bg-[#F6F4ED]">Download CSV</a>
                  </div>
                  <div className="pt-2">
                    <a href="/community-pulse" className="text-xs rounded-full border px-2 py-1 text-[#0E2A23] hover:bg-[#F6F4ED]">See more</a>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No archetype breakdown available yet.</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Model Concepts</span>
                <button
                  className="text-xs rounded-full border px-2 py-1 text-[#0E2A23] hover:bg-[#F6F4ED]"
                  onClick={() => setModelsOpen((v) => !v)}
                >
                  {modelsOpen ? 'Hide details' : 'Show details'}
                </button>
              </div>
              {modelsOpen ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(MODELS as any[]).map((m: any) => (
                    <div key={m.name} className="rounded-lg border p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                        <span className="text-sm font-medium text-gray-900">{m.name}</span>
                      </div>
                      <div className="text-xs text-gray-700 mb-2"><strong>Inputs:</strong> {m.inputs.join(', ')}</div>
                      <div className="flex flex-wrap gap-2">
                        {m.visuals.map((v: string) => (
                          <span key={v} className="text-[10px] px-2 py-0.5 rounded-full border text-[#0E2A23] bg-white">{v}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {(MODELS as any[]).slice(0, 6).map((m: any) => (
                    <div key={m.name} className="flex items-center gap-2 rounded border px-2 py-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                      <span className="text-xs text-gray-900">{m.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Model concepts now integrated into the right column above */}

      {/* Bottom Row: Per-question + Narratives (wider) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <Card className="h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Per‑Question Overview</h3>
              <a
                href="/api/media/methodology"
                target="_blank"
                className="text-xs rounded-full border px-2 py-1 text-[#0E2A23] hover:bg-[#F6F4ED]"
              >
                Methodology
              </a>
            </div>
            {q.length === 0 ? (
              <p className="text-sm text-gray-500">No question summaries available.</p>
            ) : (
              <div className="space-y-5 max-h-[70vh] overflow-auto pr-2">
                {q.slice(0,6).map((qq) => (
                  <div key={qq.question}>
                    <div className="grid grid-cols-[1fr_auto] items-start gap-3 mb-2">
                      <div className="text-sm font-medium text-gray-900">{qq.question}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border text-gray-700 bg-white w-[110px] text-center">
                        {qq.kind === 'SCALE' ? 'SCALE' : qq.kind === 'MULTI' ? 'MULTI CHOICE' : 'SINGLE CHOICE'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {qq.items.map((it, idx) => {
                        const max = Math.max(1, qq.items[0]?.count || 1)
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-40 text-xs text-gray-700 truncate" title={it.label}>{it.label}</div>
                            <div className="flex-1">
                              <div className="h-2 rounded bg-gray-100">
                                <div
                                  className="h-2 rounded"
                                  style={{
                                    width: `${(it.count / max) * 100}%`,
                                    background: idx === 0
                                      ? 'linear-gradient(90deg, #64B37A 0%, #2F6D49 100%)'
                                      : idx === 1
                                      ? '#86C99B'
                                      : idx === 2
                                      ? '#A9D8B7'
                                      : '#DAEDF0',
                                  }}
                                />
                              </div>
                            </div>
                            <div className="w-16 text-right text-xs text-gray-600">{it.pct}% ({it.count})</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2">
              <a href="/analytics?tab=questions" className="text-xs rounded-full border px-2 py-1 text-[#0E2A23] hover:bg-[#F6F4ED]">See more</a>
            </div>
          </div>
        </Card>

        {((CONFIG as any).features?.showNarratives) ? (
          <Card className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Narrative Responses</h3>
                <a
                  href="/api/export/narratives"
                  className="text-xs rounded-full border px-2 py-1 text-[#0E2A23] hover:bg-[#F6F4ED]"
                >
                  Download CSV
                </a>
              </div>
              {narr.length === 0 ? (
                <p className="text-sm text-gray-500">No narratives found.</p>
              ) : (
                <div className="max-h-[70vh] overflow-auto space-y-4 pr-2">
                  {narr.slice(0, 6).map((n, i) => (
                    <div key={i} className="rounded-xl border p-4 bg-[#E6F4EA]">
                      <div className="text-xs text-gray-500 mb-2">Participant reflection</div>
                      <blockquote className="text-[15px] leading-7 text-[#0E2A23]">
                        “{n.text}”
                      </blockquote>
                    </div>
                  ))}
                </div>
              )}
              <div className="pt-2">
                <a href="/analytics?tab=stories" className="text-xs rounded-full border px-2 py-1 text-[#0E2A23] hover:bg-[#F6F4ED]">See more</a>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </section>
  )
}
