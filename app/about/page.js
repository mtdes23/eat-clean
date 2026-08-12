"use client";

import AppLayout from "../components/AppLayout";
import { Heart, UtensilsCrossed, Calendar, ShoppingCart, Shield, Database } from "lucide-react";

const stats = [
  { icon: UtensilsCrossed, label: "Mon an", value: "28", color: "text-amber-400" },
  { icon: Calendar, label: "Ngay trong tuan", value: "7", color: "text-emerald-400" },
  { icon: ShoppingCart, label: "Nguyen lieu", value: "31+", color: "text-violet-400" },
  { icon: Database, label: "Du lieu DB", value: "SQLite", color: "text-blue-400" },
];

export default function AboutPage() {
  return (
    <AppLayout title="Gioi thieu">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-400 to-violet-400 flex items-center justify-center mx-auto mb-4 text-3xl">
            🥗
          </div>
          <h2 className="text-xl font-bold mb-1">Eat Clean</h2>
          <p className="text-sm text-zinc-500 mb-4">Ung dung quan ly thuc don an song khoe</p>
          <div className="flex items-center justify-center gap-1 text-xs text-zinc-600">
            <Heart className="w-3 h-3 text-red-400" /> Dung Next.js + Prisma + SQLite
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-2xl p-4 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[10px] text-zinc-500">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Tinh nang
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              Tao thuc don tuan ngau nhien voi 7 ngay, 3 bua/ngay
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              Theo doi luong calo hang ngay va hang tuan
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              Danh sach mua sam tu dong tu thuc don
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              Cong thuc chi tiet voi nguyen lieu va cach lam
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              Dang nhap/ dang ky tai khoan ca nhan
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              Admin panel quan ly mon an
            </li>
          </ul>
        </div>

        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-2">Admin Login</h3>
          <p className="text-xs text-zinc-500">
            Email: admin@eatclean.com
          </p>
          <p className="text-xs text-zinc-500">
            Mat khau: admin123
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
