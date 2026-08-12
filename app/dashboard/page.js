"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Flame, TrendingUp, Calendar, Trash2 } from "lucide-react";

export default function DashboardPage() {
  const [logs, setLogs] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const stored = localStorage.getItem("ec-daily-logs");
    if (stored) {
      try { setLogs(JSON.parse(stored)); } catch {}
    }
    const plans = localStorage.getItem("ec-saved-plans");
    if (plans) {
      try { setSavedPlans(JSON.parse(plans)); } catch {}
    }
  }, []);

  const todayLogs = logs.filter((l) => l.date === selectedDate);
  const totalCal = todayLogs.reduce((s, l) => s + l.calories, 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLogs = logs.filter((l) => l.date === dateStr);
    return {
      date: dateStr,
      label: d.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" }),
      total: dayLogs.reduce((s, l) => s + l.calories, 0),
      count: dayLogs.length,
    };
  }).reverse();

  const maxCal = Math.max(...last7Days.map((d) => d.total), 1);

  return (
    <AppLayout title="Theo doi dinh duong">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" /> Tong calo hom nay
            </h2>
            <span className="text-lg font-bold text-amber-400">{totalCal} kcal</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min((totalCal / 1200) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-600 mt-1">Muc tieu: 1,200 kcal/ngay</p>
        </div>

        <div className="glass rounded-2xl p-4">
          <h2 className="text-sm font-bold flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> 7 ngay gan day
          </h2>
          <div className="flex items-end gap-1 h-24">
            {last7Days.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-zinc-500 tabular-nums">{d.total}</span>
                <div
                  className="w-full rounded-t bg-emerald-400/80 transition-all duration-500 min-h-[2px]"
                  style={{ height: `${(d.total / maxCal) * 80}px` }}
                />
                <span className="text-[8px] text-zinc-600">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <h2 className="text-sm font-bold flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-violet-400" /> Lich su thuc don da luu
          </h2>
          {savedPlans.length === 0 ? (
            <p className="text-sm text-zinc-600">Chua co thuc don nao duoc luu.</p>
          ) : (
            <div className="space-y-2">
              {savedPlans.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5">
                  <div>
                    <p className="text-sm font-medium">{p.label || `Tuan ${i + 1}`}</p>
                    <p className="text-[10px] text-zinc-500">{p.date}</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = savedPlans.filter((_, j) => j !== i);
                      setSavedPlans(updated);
                      localStorage.setItem("ec-saved-plans", JSON.stringify(updated));
                    }}
                    className="text-zinc-600 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
