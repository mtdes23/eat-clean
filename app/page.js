"use client";

import { useState, useEffect } from "react";
import AppLayout from "./components/AppLayout";
import DayCard from "./components/DayCard";
import { RefreshCcw, Download, Flame } from "lucide-react";

const breakfasts = [
  { id: 'b1', name: 'Yen mach ngam sua hat', calories: 300 },
  { id: 'b2', name: 'Banh mi den & Trung op la', calories: 280 },
  { id: 'b3', name: 'Sinh to xanh', calories: 250 },
  { id: 'b4', name: 'Sua chua & Trai cay tuoi', calories: 200 },
  { id: 'b5', name: 'Khoai lang luoc & Bo dau phong', calories: 260 },
  { id: 'b6', name: 'Trung luoc & Tao xanh', calories: 150 },
  { id: 'b7', name: 'Pancake yen mach chuoi', calories: 320 },
  { id: 'b8', name: 'Bun lut tron uc ga xe', calories: 350 },
  { id: 'b9', name: 'Smoothie bowl ngu coc', calories: 280 },
];

const lunches = [
  { id: 'l1', name: 'Com ga lut & Uc ga nuong', calories: 450 },
  { id: 'l2', name: 'Salad ca ngua', calories: 380 },
  { id: 'l3', name: 'Bun lut xao thit bo', calories: 420 },
  { id: 'l4', name: 'Com lut & Ca hoi ap chao', calories: 500 },
  { id: 'l5', name: 'Mi rau cu xot ca chua', calories: 400 },
  { id: 'l6', name: 'Nui lut luon ca hoi Pesto', calories: 460 },
  { id: 'l7', name: 'Salad uc ga sot me rang', calories: 350 },
  { id: 'l8', name: 'Com quinoa & Dau hu xot nam', calories: 380 },
  { id: 'l9', name: 'Cuon tom thit luoc', calories: 320 },
  { id: 'l10', name: 'Com lut & Thit heo xao gia', calories: 430 },
];

const dinners = [
  { id: 'd1', name: 'Salad uc ga & Banh ngot', calories: 280 },
  { id: 'd2', name: 'Bo ne nic ap chao', calories: 350 },
  { id: 'd3', name: 'Tom huong & Canh bi do', calories: 300 },
  { id: 'd4', name: 'Uc ga cuon rau cu', calories: 250 },
  { id: 'd5', name: 'Sup lo xanh & Ca loc huong', calories: 280 },
  { id: 'd6', name: 'Salad dua leo & Trung luoc', calories: 200 },
  { id: 'd7', name: 'Dau hu non sot ca chua', calories: 220 },
  { id: 'd8', name: 'Canh rong bien dau non', calories: 150 },
  { id: 'd9', name: 'Bap luoc & Thit bam xao nam', calories: 300 },
];

const daysOfWeek = ["Thu 2", "Thu 3", "Thu 4", "Thu 5", "Thu 6", "Thu 7", "Chu Nhat"];

function getRandomItem(arr, excludeId) {
  let filtered = excludeId ? arr.filter((i) => i.id !== excludeId) : arr;
  if (filtered.length === 0) filtered = arr;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function generateWeek() {
  return daysOfWeek.map((day) => ({
    day,
    breakfast: getRandomItem(breakfasts),
    lunch: getRandomItem(lunches),
    dinner: getRandomItem(dinners),
  }));
}

export default function HomePage() {
  const [week, setWeek] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("ec-week");
    if (saved) {
      try { setWeek(JSON.parse(saved)); } catch { setWeek(generateWeek()); }
    } else {
      setWeek(generateWeek());
    }
  }, []);

  useEffect(() => {
    if (week.length > 0) localStorage.setItem("ec-week", JSON.stringify(week));
  }, [week]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const totalCal = week.reduce(
    (s, d) => s + d.breakfast.calories + d.lunch.calories + d.dinner.calories, 0
  );

  const typeTotals = ["breakfast", "lunch", "dinner"].map((k, i) => ({
    key: k,
    short: ["S", "T", "T"][i],
    dot: ["bg-amber-400", "bg-emerald-400", "bg-violet-400"][i],
    cal: week.reduce((s, d) => s + d[k].calories, 0),
  }));

  const genWeek = () => { setWeek(generateWeek()); showToast("Da tao thuc don moi"); };

  const refreshDay = (i) => {
    setWeek((prev) => {
      const next = [...prev];
      next[i] = {
        day: next[i].day,
        breakfast: getRandomItem(breakfasts, next[i].breakfast.id),
        lunch: getRandomItem(lunches, next[i].lunch.id),
        dinner: getRandomItem(dinners, next[i].dinner.id),
      };
      return next;
    });
  };

  const refreshMeal = (i, type) => {
    const map = { breakfast: breakfasts, lunch: lunches, dinner: dinners };
    setWeek((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [type]: getRandomItem(map[type], next[i][type].id) };
      return next;
    });
  };

  return (
    <AppLayout title="Eat Clean Menu">
      <div>
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-emerald-400 to-violet-400 flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                  Tuan nay
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {totalCal} <span className="text-xs font-normal text-zinc-500">kcal</span>
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {typeTotals.map((t) => (
                <div key={t.key} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                  <span className="text-zinc-500 text-[10px]">{t.short}</span>
                  <span className="text-white font-semibold text-xs tabular-nums">{t.cal}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bar-gradient transition-all duration-700"
              style={{ width: `${Math.min((totalCal / 8400) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={genWeek}
            className="btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-1 active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" /> Doi tuan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-3">
          {week.map((d, i) => (
            <DayCard
              key={d.day + d.breakfast.id}
              day={d}
              index={i}
              onRefresh={refreshDay}
              onRefreshMeal={refreshMeal}
            />
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed left-3 right-3 top-4 z-50 max-w-sm mx-auto pointer-events-none">
          <div className="glass-strong rounded-xl px-4 py-2.5 text-sm text-white flex items-center gap-2.5 shadow-2xl">
            <span className="w-4 h-4 text-emerald-400 shrink-0">&#10003;</span>
            {toast}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
