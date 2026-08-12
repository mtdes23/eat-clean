"use client";

import AppLayout from "../components/AppLayout";
import { useRouter } from "next/navigation";
import { Flame, ChevronRight } from "lucide-react";

const allMeals = [
  { id: 'b1', name: 'Yen mach ngam sua hat', calories: 300, type: 'breakfast' },
  { id: 'b2', name: 'Banh mi den & Trung op la', calories: 280, type: 'breakfast' },
  { id: 'b3', name: 'Sinh to xanh', calories: 250, type: 'breakfast' },
  { id: 'b4', name: 'Sua chua & Trai cay tuoi', calories: 200, type: 'breakfast' },
  { id: 'b5', name: 'Khoai lang luoc & Bo dau phong', calories: 260, type: 'breakfast' },
  { id: 'b6', name: 'Trung luoc & Tao xanh', calories: 150, type: 'breakfast' },
  { id: 'b7', name: 'Pancake yen mach chuoi', calories: 320, type: 'breakfast' },
  { id: 'b8', name: 'Bun lut tron uc ga xe', calories: 350, type: 'breakfast' },
  { id: 'b9', name: 'Smoothie bowl ngu coc', calories: 280, type: 'breakfast' },
  { id: 'l1', name: 'Com ga lut & Uc ga nuong', calories: 450, type: 'lunch' },
  { id: 'l2', name: 'Salad ca ngua', calories: 380, type: 'lunch' },
  { id: 'l3', name: 'Bun lut xao thit bo', calories: 420, type: 'lunch' },
  { id: 'l4', name: 'Com lut & Ca hoi ap chao', calories: 500, type: 'lunch' },
  { id: 'l5', name: 'Mi rau cu xot ca chua', calories: 400, type: 'lunch' },
  { id: 'l6', name: 'Nui lut luon ca hoi Pesto', calories: 460, type: 'lunch' },
  { id: 'l7', name: 'Salad uc ga sot me rang', calories: 350, type: 'lunch' },
  { id: 'l8', name: 'Com quinoa & Dau hu xot nam', calories: 380, type: 'lunch' },
  { id: 'l9', name: 'Cuon tom thit luoc', calories: 320, type: 'lunch' },
  { id: 'l10', name: 'Com lut & Thit heo xao gia', calories: 430, type: 'lunch' },
  { id: 'd1', name: 'Salad uc ga & Banh ngot', calories: 280, type: 'dinner' },
  { id: 'd2', name: 'Bo ne nic ap chao', calories: 350, type: 'dinner' },
  { id: 'd3', name: 'Tom huong & Canh bi do', calories: 300, type: 'dinner' },
  { id: 'd4', name: 'Uc ga cuon rau cu', calories: 250, type: 'dinner' },
  { id: 'd5', name: 'Sup lo xanh & Ca loc huong', calories: 280, type: 'dinner' },
  { id: 'd6', name: 'Salad dua leo & Trung luoc', calories: 200, type: 'dinner' },
  { id: 'd7', name: 'Dau hu non sot ca chua', calories: 220, type: 'dinner' },
  { id: 'd8', name: 'Canh rong bien dau non', calories: 150, type: 'dinner' },
  { id: 'd9', name: 'Bap luoc & Thit bam xao nam', calories: 300, type: 'dinner' },
];

const categories = [
  { key: 'breakfast', label: 'Bua Sang', color: '#f59e0b', dot: 'bg-amber-400', card: 'meal-amber' },
  { key: 'lunch', label: 'Bua Trua', color: '#10b981', dot: 'bg-emerald-400', card: 'meal-emerald' },
  { key: 'dinner', label: 'Bua Toi', color: '#8b5cf6', dot: 'bg-violet-400', card: 'meal-violet' },
];

export default function MealsPage() {
  const router = useRouter();

  return (
    <AppLayout title="Tat ca Mon an">
      <div className="space-y-5">
        {categories.map((cat) => (
          <section key={cat.key}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
              <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: cat.color }}>
                {cat.label}
              </h2>
            </div>
            <div className="space-y-2">
              {allMeals
                .filter((m) => m.type === cat.key)
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => router.push(`/recipe/${m.id}`)}
                    className={`glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 active:scale-[0.98] ${cat.card}`}
                  >
                    <div className="w-1.5 h-12 rounded-full" style={{ background: cat.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/90 truncate">{m.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: cat.color }}>
                        <Flame className="w-3 h-3 inline -mt-0.5" /> {m.calories} kcal
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0" />
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </AppLayout>
  );
}
