"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, AlertTriangle, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  getFridgeItems,
  addFridgeItem,
  updateFridgeItem,
  deleteFridgeItem,
} from "@/lib/storage";
import { FOOD_CATEGORIES, FoodCategory, FridgeItem } from "@/types";
import { CATEGORY_EMOJI, CATEGORY_COLOR, daysUntil } from "@/lib/category-style";

export default function FridgePage() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [filter, setFilter] = useState<FoodCategory | "Alle">("Alle");
  const [showAdd, setShowAdd] = useState(false);

  function reload() {
    setItems(getFridgeItems());
  }

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(
    () => (filter === "Alle" ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  const grouped = useMemo(() => {
    const map = new Map<FoodCategory, FridgeItem[]>();
    filtered.forEach((item) => {
      const arr = map.get(item.category) || [];
      arr.push(item);
      map.set(item.category, arr);
    });
    return map;
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="Meine Lebensmittel"
        subtitle={`${items.length} Einträge im Kühlschrank`}
        right={
          <button
            onClick={() => setShowAdd(true)}
            className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-card"
            aria-label="Lebensmittel hinzufügen"
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="px-5">
        {/* Kategorie-Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
          {(["Alle", ...FOOD_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`pill whitespace-nowrap shrink-0 border ${
                filter === cat
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {cat !== "Alle" && CATEGORY_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="card p-6 text-center text-sm text-gray-400 mt-2">
            Noch keine Lebensmittel erfasst. Scanne deinen Kühlschrank oder füge manuell hinzu.
          </div>
        ) : (
          <div className="space-y-5 mt-1">
            {Array.from(grouped.entries()).map(([category, catItems]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  {CATEGORY_EMOJI[category]} {category} ({catItems.length})
                </p>
                <div className="space-y-2">
                  {catItems.map((item) => (
                    <FridgeRow key={item.id} item={item} onChanged={reload} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onAdded={reload} />}
    </div>
  );
}

function FridgeRow({ item, onChanged }: { item: FridgeItem; onChanged: () => void }) {
  const expiresIn = item.expiryDate ? daysUntil(item.expiryDate) : null;
  const isSoon = expiresIn !== null && expiresIn <= 3;

  return (
    <div className="card p-3 flex items-center gap-3">
      <span className="text-2xl">{CATEGORY_EMOJI[item.category]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-900 truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {item.quantity && <span className="text-xs text-gray-400">{item.quantity}</span>}
          {expiresIn !== null && (
            <span
              className={`pill ${
                isSoon ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
              } flex items-center gap-1`}
            >
              {isSoon && <AlertTriangle size={11} />}
              {expiresIn >= 0 ? `noch ${expiresIn}d` : `${Math.abs(expiresIn)}d abgelaufen`}
            </span>
          )}
          {item.source === "scan" && (
            <span className={`pill ${CATEGORY_COLOR[item.category]}`}>KI-Scan</span>
          )}
        </div>
      </div>
      <button
        onClick={() => {
          deleteFridgeItem(item.id);
          onChanged();
        }}
        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 shrink-0"
        aria-label="Löschen"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function AddItemModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("Sonstiges");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addFridgeItem({
      name: name.trim(),
      category,
      quantity: quantity.trim() || undefined,
      expiryDate: expiryDate || undefined,
      source: "manual",
    });
    onAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-md p-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-brand-900">Lebensmittel hinzufügen</p>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Name *</label>
            <input
              className="input-field mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. Paprika"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Kategorie</label>
            <select
              className="input-field mt-1"
              value={category}
              onChange={(e) => setCategory(e.target.value as FoodCategory)}
            >
              {FOOD_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_EMOJI[c]} {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Menge (optional)</label>
              <input
                className="input-field mt-1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="z. B. 500g"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Haltbar bis (optional)</label>
              <input
                type="date"
                className="input-field mt-1"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full mt-2">
            Hinzufügen
          </button>
        </form>
      </div>
    </div>
  );
}
