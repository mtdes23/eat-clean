"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { ShoppingCart, Check, Trash2, Plus } from "lucide-react";

const defaultItems = [
  "Ga nac/uc ga",
  "Trung ga",
  "Rau bina (cai bo xoi)",
  "Bo",
  "Chuoi",
  "Yen mach",
  "Hat chia",
  "Sua hat khong duong",
  "Khoai lang",
  "Bo dau phong",
  "Tao xanh",
  "Sua chua khong duong",
  "Dau tay",
  "Ca hoi phi le",
  "Mang tay",
  "Ga lut",
  "Sup lo xanh",
  "Dau oliu",
  "Ca ngua",
  "Xoai xanh",
  "Ca chua bi",
  "Dua leo",
  "Hat dieu",
  "Thit bo nac",
  "Cai thia",
  "Xi dau diet",
  "Mi ga lut",
  "Thit nic",
  "Muoi hong",
  "Tieu chanh",
];

export default function ShoppingPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("ec-shopping");
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch {}
    } else {
      setItems(defaultItems.map((name) => ({ name, checked: false })));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) localStorage.setItem("ec-shopping", JSON.stringify(items));
  }, [items]);

  const toggle = (i) => {
    setItems((prev) =>
      prev.map((item, j) => (j === i ? { ...item, checked: !item.checked } : item))
    );
  };

  const remove = (i) => {
    setItems((prev) => prev.filter((_, j) => j !== i));
  };

  const add = () => {
    if (!newItem.trim()) return;
    setItems((prev) => [...prev, { name: newItem.trim(), checked: false }]);
    setNewItem("");
  };

  const clearChecked = () => {
    setItems((prev) => prev.filter((i) => !i.checked));
  };

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <AppLayout title="Danh sach mua sam">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" /> Nguyen lieu
            </h2>
            <span className="text-xs text-zinc-500">
              {checkedCount}/{items.length} da mua
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Them nguyen lieu moi..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20"
            />
            <button
              onClick={add}
              className="btn px-3 py-2 rounded-xl flex items-center gap-1 text-sm text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 max-h-[50vh] overflow-y-auto">
            {items.map((item, i) => (
              <div
                key={i}
                onClick={() => toggle(i)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99]"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                    item.checked ? "border-emerald-400 bg-emerald-400/20" : "border-zinc-600"
                  }`}
                >
                  {item.checked && <Check className="w-3 h-3 text-emerald-400" />}
                </div>
                <span
                  className={`flex-1 text-sm transition-all duration-200 ${
                    item.checked ? "text-zinc-500 line-through" : "text-white/90"
                  }`}
                >
                  {item.name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  className="text-zinc-600 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {checkedCount > 0 && (
          <button
            onClick={clearChecked}
            className="w-full btn px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 flex items-center justify-center gap-2 active:scale-95"
          >
            <Trash2 className="w-4 h-4" /> Xoa da mua ({checkedCount})
          </button>
        )}
      </div>
    </AppLayout>
  );
}
