"use client";

import { useEffect, useState } from 'react';
import AppHeader from '@/components/ui/app-header';
import PrimaryButton from '@/components/ui/primary-button';

export const dynamic = "force-dynamic";

function Card({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white shadow border">
      <header className="px-5 py-3 border-b">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
      {footer ? <footer className="px-5 py-3 border-t bg-gray-50">{footer}</footer> : null}
    </section>
  );
}

export default function ReportsPage() {
  const csvHref = "/api/export/csv";
  const metricsHref = "/api/export/engagement";
  const demoHref = "/api/export/demographics";
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ghac:premium');
      setPremium(raw === '1');
    } catch {}
  }, []);

  function upgrade() {
    alert('Premium features are coming soon. Contact Nesolagus to enable.');
  }

  return (
    <section className="p-6 space-y-6">
      <AppHeader title="Reports" subtitle="Export data, schedule reports, and manage integrations" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Data Export">
          <ul className="text-sm space-y-3 text-gray-700">
            <li className="flex items-center justify-between gap-3 border rounded p-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#64B37A]" />
                <span>Full dataset (CSV)</span>
              </div>
              <a className="inline-flex items-center rounded-full border px-3 py-1 text-xs bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23]" href={csvHref} download>Export</a>
            </li>
            <li className="flex items-center justify-between gap-3 border rounded p-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#64B37A]" />
                <span>Engagement metrics (CSV)</span>
              </div>
              <a className="inline-flex items-center rounded-full border px-3 py-1 text-xs bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23]" href={metricsHref} download>Export</a>
            </li>
            <li className="flex items-center justify-between gap-3 border rounded p-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#64B37A]" />
                <span>Demographics (CSV)</span>
              </div>
              <a className="inline-flex items-center rounded-full border px-3 py-1 text-xs bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23]" href={demoHref} download>Export</a>
            </li>
            <li className="text-xs text-gray-500">Columns auto‑match latest schema; timestamps in UTC. Tip: filter to last 90 days for faster downloads.</li>
          </ul>
        </Card>

        <Card
          title="Automated Reports"
          footer={<button onClick={upgrade} className="rounded-full border px-3 py-1 text-sm bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23]">Upgrade to Premium</button>}
        >
          <p className="text-sm text-gray-700">Schedule weekly or monthly PDFs to stakeholders with KPI deltas and narrative highlights.</p>
          <ul className="mt-4 text-sm space-y-2 text-gray-700">
            <li>• Weekly engagement summaries</li>
            <li>• Monthly donor analytics</li>
            <li>• Quarterly strategic insights</li>
          </ul>
        </Card>

        <Card
          title="CRM Integration"
          footer={<button onClick={upgrade} className="rounded-full border px-3 py-1 text-sm bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23]">Upgrade to Premium</button>}
        >
          <p className="text-sm text-gray-700">Sync donor & contact data to your CRM for campaigns and workflows.</p>
          <ul className="mt-4 text-sm space-y-2 text-gray-700">
            <li>• Salesforce & HubSpot compatibility</li>
            <li>• Real‑time data sync</li>
            <li>• Custom field mapping</li>
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="API Integration" footer={<button onClick={upgrade} className="rounded-full border px-3 py-1 text-sm bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23]">View Documentation</button>}>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Use our REST API and webhooks to power custom dashboards and pipelines.</p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center border rounded p-2">
              <div className="text-sm text-gray-700">Coming soon: API keys & webhooks in Settings → Developer</div>
              <button onClick={upgrade} className="rounded-full border px-3 py-1 text-xs bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23]">Notify me</button>
            </div>
          </div>
        </Card>

        <Card title="Report Overview">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-3"><dt className="text-gray-500">Last CSV Export</dt><dd className="mt-1 font-semibold text-gray-900">—</dd></div>
            <div className="rounded-lg border p-3"><dt className="text-gray-500">Last Metrics Export</dt><dd className="mt-1 font-semibold text-gray-900">—</dd></div>
            <div className="rounded-lg border p-3"><dt className="text-gray-500">Scheduled Reports</dt><dd className="mt-1 font-semibold text-gray-900">{premium ? 'Enabled' : '—'}</dd></div>
            <div className="rounded-lg border p-3"><dt className="text-gray-500">Last Sync Status</dt><dd className="mt-1 font-semibold text-gray-900">—</dd></div>
          </dl>
        </Card>

        <Card title="Data Security & Compliance">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Enterprise-Grade Security</h4>
              <p className="text-xs text-blue-800">
                Warren follows SOC 2 equivalent controls and privacy-by-design architecture for sensitive community data protection.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900">Security & Privacy Practices</h5>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 256-bit encryption in transit and at rest</li>
                <li>• Zero data sales • Never sold to third parties</li>
                <li>• SOC 2 equivalent security controls</li>
                <li>• GDPR, COPPA, FERPA compliant processing</li>
                <li>• Export your data anytime</li>
                <li>• Privacy-by-design architecture</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
