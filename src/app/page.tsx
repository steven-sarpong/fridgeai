"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScanLine, Flame, Beef, Refrigerator, ChevronRight, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getFridgeItems, getTodaysMeals, getTodaysTotals, getExpiringItems } from "@/lib/storage";
import { FridgeItem, Meal } from "@/types";
import { CATEGORY_EMOJI, daysUntil } from "@/lib/category-style";

export default function DashboardPage() {
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const [recentScans, setRecentScans] = useState<FridgeItem[]>([]);
  const [expiring, setExpiring] = useState<FridgeItem[]>([]);

  useEffect(() => {
    setTotals(getTodaysTotals());
    setTodaysMeals(getTodaysMeals().slice(0, 4));
    setRecentScans(
      getFridgeItems()
        .filter((i) => i.source === "scan")
        .slice(0, 5)
    );
    setExpiring(getExpiringItems(3));
  }, []);

  return (
    <div>
      <PageHeader title="Hallo 👋" subtitle="Hier ist dein Überblick für heute" />

      <div className="px-5 space-y-5">
        {/* Großer Scan-CTA */}
        <Link
          href="/scan"
          className="block bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl2 p-5 text-white shadow-cardHover active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-100">Neuer Scan</p>
              <p className="text-lg font-bold mt-1">Kühlschrank scannen</p>
              <p className="text-xs text-brand-100 mt-1">KI erkennt deine Zutaten automatisch</p>
            </div>
            <span className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
              <ScanLine size={28} />
            </span>
          </div>
        </Link>

        {/* Ablauf-Warnung */}
        {expiring.length > 0 && (
          <Link
            href="/fridge"
            className="card p-4 flex items-center gap-3 border-amber-200 bg-amber-50"
          >
            <AlertTriangle size={20} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">{expiring.length} Lebensmittel</span> laufen bald ab
            </p>
            <ChevronRight size={18} className="ml-auto text-amber-500" />
          </Link>
        )}

        {/* Tagesübersicht */}
        <div className="card p-4">
          <p className="text-sm font-semibold text-gray-500 mb-3">Heute</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-accent-100 flex items-center justify-center mb-1">
                <Flame size={20} className="text-accent-500" />
              </div>
              <p className="text-lg font-bold text-brand-900">{Math.round(totals.calories)}</p>
              <p className="text-[11px] text-gray-500">kcal</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center mb-1">
                <Beef size={20} className="text-rose-500" />
              </div>
              <p className="text-lg font-bold text-brand-900">{Math.round(totals.protein)}g</p>
              <p className="text-[11px] text-gray-500">Protein</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center mb-1">
                <Refrigerator size={20} className="text-brand-600" />
              </div>
              <p className="text-lg font-bold text-brand-900">{recentScans.length}</p>
              <p className="text-[11px] text-gray-500">Scans</p>
            </div>
          </div>
        </div>

        {/* Heutige Mahlzeiten */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-500">Heutige Mahlzeiten</p>
            <Link href="/meals" className="text-xs text-brand-600 font-medium flex items-center">
              Alle <ChevronRight size={14} />
            </Link>
          </div>
          {todaysMeals.length === 0 ? (
            <div className="card p-4 text-sm text-gray-400 text-center">
              Noch keine Mahlzeiten erfasst
            </div>
          ) : (
            <div className="space-y-2">
              {todaysMeals.map((m) => (
                <div key={m.id} className="card p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-900">{m.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(m.eatenAt).toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="pill bg-brand-50 text-brand-700">{m.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Letzte Scans */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-500">Zuletzt gescannt</p>
            <Link href="/fridge" className="text-xs text-brand-600 font-medium flex items-center">
              Kühlschrank <ChevronRight size={14} />
            </Link>
          </div>
          {recentScans.length === 0 ? (
            <div className="card p-4 text-sm text-gray-400 text-center">
              Noch keine Scans vorhanden
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {recentScans.map((item) => (
                <div
                  key={item.id}
                  className="card p-3 min-w-[100px] flex flex-col items-center shrink-0"
                >
                  <span className="text-2xl">{CATEGORY_EMOJI[item.category]}</span>
                  <p className="text-xs font-medium text-brand-900 mt-1 text-center">
                    {item.name}
                  </p>
                  {item.expiryDate && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {daysUntil(item.expiryDate)}d
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
