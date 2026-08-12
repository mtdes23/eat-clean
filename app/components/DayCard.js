"use client";

import { useRouter } from "next/navigation";
import { RefreshCcw, Flame, ChevronRight } from "lucide-react";

const typeConfig = {
  breakfast: { color: "#f59e0b", dot: "bg-amber-400", label: "Sang", card: "meal-amber" },
  lunch: { color: "#10b981", dot: "bg-emerald-400", label: "Trua", card: "meal-emerald" },
  dinner: { color: "#8b5cf6", dot: "bg-violet-400", label: "Toi", card: "meal-violet" },
};

export default function DayCard({ day, index, onRefresh, onRefreshMeal }) {
  const router = useRouter();
  const totalCal = day.breakfast.calories + day.lunch.calories + day.dinner.calories;
  const pct = Math.min((totalCal / 1200) * 100, 100);
  const barColor = pct < 50 ? "bg-emerald-400" : pct < 85 ? "bg-amber-400" : "bg-red-400";

  return (
    <div
      className="glass rounded-2xl p-4 anim-fade"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-bold text-white/90">{day.day}</p>
          <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
            <Flame className="w-3 h-3 inline" /> {totalCal} kcal
          </p>
        </div>
        <button
          onClick={() => onRefresh(index)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Doi ngay"
        >
          <RefreshCcw className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>

      <div className="h-1 bg-white/8 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-2">
        {["breakfast", "lunch", "dinner"].map((type) => {
          const meal = day[type];
          const cfg = typeConfig[type];
          return (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-1 h-8 rounded-full shrink-0"
                style={{ background: cfg.color }}
              />
              <div
                className="flex-1 min-w-0 cursor-pointer hover:bg-white/5 rounded-lg px-2 py-1 transition-all"
                onClick={() => router.push(`/recipe/${meal.id}`)}
              >
                <p className="text-[11px] font-semibold text-white/80 truncate">{meal.name}</p>
                <p className="text-[10px] flex items-center gap-1" style={{ color: cfg.color }}>
                  <Flame className="w-2.5 h-2.5 inline" /> {meal.calories} kcal
                </p>
              </div>
              <button
                onClick={() => onRefreshMeal(index, type)}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                aria-label="Doi mon"
              >
                <RefreshCcw className="w-3 h-3 text-zinc-500" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
