"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Plus, Pencil, Trash2, Save, X, UtensilsCrossed } from "lucide-react";

const emptyMeal = {
  id: "",
  name: "",
  type: "breakfast",
  calories: 250,
  time: "",
  servings: "1 phan",
  ingredients: [],
  steps: [],
};

const typeOptions = [
  { value: "breakfast", label: "Bua Sang" },
  { value: "lunch", label: "Bua Trua" },
  { value: "dinner", label: "Bua Toi" },
];

export default function AdminPage() {
  const [meals, setMeals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await fetch("/api/meals");
      const data = await res.json();
      setMeals(data);
    } catch {}
    setLoading(false);
  };

  const save = async () => {
    if (!editing.name || !editing.id) return;
    try {
      const method = meals.find((m) => m.id === editing.id) ? "PUT" : "POST";
      const url = method === "POST" ? "/api/meals" : `/api/meals/${editing.id}`;
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      setEditing(null);
      fetchMeals();
    } catch (err) {
      alert("Loi luu: " + err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Xoa mon an nay?")) return;
    try {
      await fetch(`/api/meals/${id}`, { method: "DELETE" });
      fetchMeals();
    } catch {}
  };

  const groups = {
    breakfast: meals.filter((m) => m.type === "breakfast"),
    lunch: meals.filter((m) => m.type === "lunch"),
    dinner: meals.filter((m) => m.type === "dinner"),
  };

  return (
    <AppLayout title="Quan Ly Mon An">
      <div className="space-y-4">
        <button
          onClick={() => setEditing({ ...emptyMeal, id: `m${Date.now()}` })}
          className="btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white active:scale-95"
        >
          <Plus className="w-4 h-4" /> Them mon an moi
        </button>

        {editing && (
          <div className="glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Pencil className="w-4 h-4 text-amber-400" /> Sua mon an
              </h3>
              <button onClick={() => setEditing(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              placeholder="ID (vi du: b1)"
              value={editing.id}
              onChange={(e) => setEditing({ ...editing, id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none"
            />
            <input
              placeholder="Ten mon an"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none"
            />
            <div className="flex gap-2">
              <select
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              >
                {typeOptions.map((t) => (
                  <option key={t.value} value={t.value} className="bg-black">
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Calo"
                value={editing.calories}
                onChange={(e) => setEditing({ ...editing, calories: parseInt(e.target.value) || 0 })}
                className="w-24 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              />
            </div>
            <input
              placeholder="Thoi gian nau (vi du: 15 phut)"
              value={editing.time || ""}
              onChange={(e) => setEditing({ ...editing, time: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none"
            />
            <textarea
              placeholder="Nguyen lieu (moi dong 1)"
              value={(editing.ingredients || []).join("\n")}
              onChange={(e) => setEditing({ ...editing, ingredients: e.target.value.split("\n").filter(Boolean) })}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none h-24"
            />
            <textarea
              placeholder="Cach lam (moi buoc 1 dong)"
              value={(editing.steps || []).join("\n")}
              onChange={(e) => setEditing({ ...editing, steps: e.target.value.split("\n").filter(Boolean) })}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none h-24"
            />
            <button
              onClick={save}
              className="btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-400 active:scale-95"
            >
              <Save className="w-4 h-4" /> Luu
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-zinc-500 text-center py-8">Dang tai...</p>
        ) : (
          Object.entries(groups).map(([type, items]) => (
            <div key={type}>
              <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2 flex items-center gap-2">
                <UtensilsCrossed className="w-3.5 h-3.5" /> {type} ({items.length})
              </h3>
              <div className="space-y-1">
                {items.map((m) => (
                  <div key={m.id} className="glass rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-[10px] text-zinc-500">{m.calories} kcal</p>
                    </div>
                    <button
                      onClick={() => setEditing({ ...m, ingredients: [], steps: [] })}
                      className="text-zinc-500 hover:text-amber-400"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(m.id)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
