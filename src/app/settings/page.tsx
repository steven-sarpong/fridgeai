"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, Trash2, Info } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { resetAllData } from "@/lib/storage";

export default function SettingsPage() {
  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    resetAllData();
    setConfirmReset(false);
    window.location.href = "/";
  }

  return (
    <div>
      <PageHeader title="Einstellungen" subtitle="API-Key, Datenschutz & Daten" />

      <div className="px-5 space-y-4">
        <section className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound size={18} className="text-brand-600" />
            <p className="font-semibold text-brand-900 text-sm">OpenRouter API-Key</p>
          </div>
          <p className="text-sm text-gray-500">
            Diese App nutzt <span className="font-medium">OpenRouter</span>, um KI-Modelle für
            Bildanalyse und Rezeptvorschläge anzusprechen. Der API-Key wird ausschließlich
            serverseitig verwendet und niemals an den Browser übertragen.
          </p>
          <ol className="text-sm text-gray-500 list-decimal list-inside mt-2 space-y-1">
            <li>
              Account auf{" "}
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 underline"
              >
                openrouter.ai
              </a>{" "}
              erstellen
            </li>
            <li>API-Key unter „Keys“ generieren</li>
            <li>
              Key in der Datei <code className="bg-gray-100 px-1 rounded">.env.local</code> als{" "}
              <code className="bg-gray-100 px-1 rounded">OPENROUTER_API_KEY</code> eintragen
            </li>
            <li>Server neu starten</li>
          </ol>
        </section>

        <section className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} className="text-brand-600" />
            <p className="font-semibold text-brand-900 text-sm">Verwendete Modelle</p>
          </div>
          <p className="text-sm text-gray-500">
            Hauptmodell für Bildanalyse und Rezepte sowie ein automatisches Fallback-Modell
            werden über Umgebungsvariablen konfiguriert (
            <code className="bg-gray-100 px-1 rounded">OPENROUTER_PRIMARY_MODEL</code>,{" "}
            <code className="bg-gray-100 px-1 rounded">OPENROUTER_FALLBACK_MODEL</code>,{" "}
            <code className="bg-gray-100 px-1 rounded">OPENROUTER_TEXT_MODEL</code>). Ist das
            Hauptmodell nicht erreichbar, wechselt die App automatisch zum Fallback.
          </p>
        </section>

        <section className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-brand-600" />
            <p className="font-semibold text-brand-900 text-sm">Datenschutz</p>
          </div>
          <p className="text-sm text-gray-500">
            Deine Kühlschrank- und Mahlzeiten-Daten werden ausschließlich lokal in deinem Browser
            gespeichert (localStorage) – es gibt keine Server-Datenbank. Fotos werden nur zur
            Analyse an OpenRouter gesendet und nicht dauerhaft von dieser App gespeichert.
          </p>
        </section>

        <section className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 size={18} className="text-rose-500" />
            <p className="font-semibold text-brand-900 text-sm">Alle Daten löschen</p>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Entfernt alle gespeicherten Lebensmittel und Mahlzeiten unwiderruflich von diesem
            Gerät.
          </p>
          {confirmReset ? (
            <div className="flex gap-2">
              <button onClick={handleReset} className="btn-primary flex-1 bg-rose-600 hover:bg-rose-700">
                Wirklich löschen
              </button>
              <button onClick={() => setConfirmReset(false)} className="btn-secondary flex-1">
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="btn-secondary w-full text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Alle Daten zurücksetzen
            </button>
          )}
        </section>

        <p className="text-center text-xs text-gray-300 pt-2">FridgeAI · SmartMeal Tracker</p>
      </div>
    </div>
  );
}
