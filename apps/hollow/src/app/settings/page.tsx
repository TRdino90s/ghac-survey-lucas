"use client";

import { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/primary-button";

type Prefs = {
  orgName: string;
  primaryFrom: string;
  primaryTo: string;
  compactUI: boolean;
};

const PREF_KEY = "ghac:prefs:v1";
const AUTH_KEY = "ghac:auth:v1";

const DEFAULTS: Prefs = {
  orgName: "GHAC Community Den",
  primaryFrom: "#64B37A",
  primaryTo: "#2F6D49",
  compactUI: false,
};

type AuthState = {
  signedIn: boolean;
  email?: string;
};

function Section({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white shadow border">
      <header className="px-5 py-3 border-b">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {subtitle ? <p className="text-xs text-gray-500 mt-1">{subtitle}</p> : null}
      </header>
      <div className="p-5 space-y-4">{children}</div>
      {footer ? <footer className="px-5 py-3 border-t bg-gray-50">{footer}</footer> : null}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 sm:grid-cols-[220px_1fr] items-center">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      {children}
    </label>
  );
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [auth, setAuth] = useState<AuthState>({ signedIn: false });
  const [emailInput, setEmailInput] = useState("");

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) });
    } catch {}

    try {
      const rawAuth = localStorage.getItem(AUTH_KEY);
      if (rawAuth) setAuth(JSON.parse(rawAuth));
    } catch {}
  }, []);

  function savePrefs(next: Prefs) {
    setPrefs(next);
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(next));
      setSavedAt(new Date().toLocaleTimeString());
      // also update CSS vars live
      const root = document.documentElement;
      root.style.setProperty("--brand-from", next.primaryFrom);
      root.style.setProperty("--brand-to", next.primaryTo);
      if (next.compactUI) root.classList.add("ui-compact");
      else root.classList.remove("ui-compact");
    } catch {}
  }

  function resetDefaults() {
    savePrefs(DEFAULTS);
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(prefs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ghac-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function signIn() {
    if (!emailInput.trim()) return;
    const next = { signedIn: true, email: emailInput.trim() };
    setAuth(next);
    localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  }

  function signOut() {
    const next = { signedIn: false } as AuthState;
    setAuth(next);
    localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  }

  return (
    <main className="min-h-screen bg-[#F7F7F6] text-[#0E2A23] p-6 space-y-8">

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account */}
        <Section title="Account" subtitle="Your sign-in and profile details.">
          <Row label="Email">
            <div className="text-sm text-gray-700">{auth.email || '—'}</div>
          </Row>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" subtitle="Choose which messages you'd like to receive.">
          <Row label="Project updates">
            <input type="checkbox" className="h-4 w-4" />
          </Row>
          <Row label="Weekly report (email)">
            <input type="checkbox" className="h-4 w-4" />
          </Row>
          <Row label="Outage notices">
            <input type="checkbox" className="h-4 w-4" />
          </Row>
        </Section>

        {/* Data */}
        <Section title="Data" subtitle="Export or clear your local app data.">
          <Row label="Export settings JSON">
            <button
              onClick={downloadJSON}
              className="rounded-full border px-3 py-1 text-sm bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23] hover:brightness-95"
            >
              Download
            </button>
          </Row>
          <Row label="Clear local data">
            <button
              onClick={() => {
                try {
                  localStorage.removeItem(PREF_KEY);
                  localStorage.removeItem(AUTH_KEY);
                  setSavedAt(null);
                  alert('Local data cleared.');
                } catch {}
              }}
              className="rounded-full border px-3 py-1 text-sm bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23] hover:brightness-95"
            >
              Clear
            </button>
          </Row>
        </Section>

        {/* Branding & UI */}
        <Section
          title="Branding & UI"
          subtitle="Local-only preferences. To make global, wire these into your server config or user profile."
          footer={
            <div className="flex items-center justify-between">
              <button
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={resetDefaults}
              >
                Reset to defaults
              </button>
              <button
                onClick={downloadJSON}
                className="rounded-full border px-3 py-1 text-sm bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23] hover:brightness-95"
              >
                Download JSON
              </button>
            </div>
          }
        >
          <Row label="Organization name">
            <input
              className="h-9 w-full rounded-md border px-3 text-sm"
              value={prefs.orgName}
              onChange={(e) => savePrefs({ ...prefs, orgName: e.target.value })}
              placeholder="GHAC Community Den"
            />
          </Row>

          <Row label="Primary gradient — From">
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="h-9 w-12 rounded border"
                value={prefs.primaryFrom}
                onChange={(e) => savePrefs({ ...prefs, primaryFrom: e.target.value })}
              />
              <input
                className="h-9 w-full rounded-md border px-3 text-sm"
                value={prefs.primaryFrom}
                onChange={(e) => savePrefs({ ...prefs, primaryFrom: e.target.value })}
              />
            </div>
          </Row>

          <Row label="Primary gradient — To">
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="h-9 w-12 rounded border"
                value={prefs.primaryTo}
                onChange={(e) => savePrefs({ ...prefs, primaryTo: e.target.value })}
              />
              <input
                className="h-9 w-full rounded-md border px-3 text-sm"
                value={prefs.primaryTo}
                onChange={(e) => savePrefs({ ...prefs, primaryTo: e.target.value })}
              />
            </div>
          </Row>

          <Row label="Compact UI">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={prefs.compactUI}
              onChange={(e) => savePrefs({ ...prefs, compactUI: e.target.checked })}
            />
          </Row>

          <div className="grid sm:grid-cols-[220px_1fr]">
            <div className="text-sm font-medium text-gray-800">Preview</div>
            <div className="rounded-lg border p-4">
              <div
                className="rounded-md px-4 py-2 text-white w-fit"
                style={{
                  background: `linear-gradient(90deg, ${prefs.primaryFrom} 0%, ${prefs.primaryTo} 100%)`,
                }}
              >
                Primary Button
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Saved {savedAt ? `at ${savedAt}` : "locally"}.
              </p>
            </div>
          </div>
        </Section>

        {/* Sign-in / Sign-out (local demo) */}
        <Section
          title="Sign in"
          subtitle="Demo-only: persists locally. Replace with your real auth later."
          footer={
            auth.signedIn ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Signed in as <strong>{auth.email}</strong>
                </span>
                <button onClick={signOut} className="rounded-full border px-3 py-1 text-sm bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23] hover:brightness-95">Sign out</button>
              </div>
            ) : (
              <div className="flex items-center justify-end">
                <button onClick={signIn} className="rounded-full border px-3 py-1 text-sm bg-[#E6F4EA] border-[#CDEBD8] text-[#0E2A23] hover:brightness-95">Sign in</button>
              </div>
            )
          }
        >
          {auth.signedIn ? (
            <>
              <Row label="Status">
                <div className="text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Authenticated</span>
                  </span>
                </div>
              </Row>
              <Row label="Email">
                <input
                  className="h-9 w-full rounded-md border px-3 text-sm"
                  value={auth.email || ""}
                  onChange={(e) => {
                    const next = { signedIn: true, email: e.target.value };
                    setAuth(next);
                    localStorage.setItem(AUTH_KEY, JSON.stringify(next));
                  }}
                />
              </Row>
            </>
          ) : (
            <>
              <Row label="Email">
                <input
                  className="h-9 w-full rounded-md border px-3 text-sm"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@org.org"
                />
              </Row>
              <p className="text-xs text-gray-500">
                This is a lightweight local sign-in for demos. Hook up your real provider later.
              </p>
            </>
          )}
        </Section>
      </div>
    </main>
  );
}
