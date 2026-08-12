"use client";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { User, Mail, Lock, LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Loi");
      if (mode === "register") {
        setMsg("Dang ky thanh cong! Dang nhap ngay.");
        setMode("login");
      } else {
        setUser(data.user);
        setMsg("Dang nhap thanh cong!");
      }
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (user) {
    return (
      <AppLayout title="Tai khoan">
        <div className="glass rounded-2xl p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-emerald-400 to-violet-400 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold mb-1">{user.name}</h2>
          <p className="text-sm text-zinc-500 mb-4">{user.email}</p>
          <p className="text-xs text-zinc-600 mb-4">Vai tro: {user.role}</p>
          <button
            onClick={() => { setUser(null); setEmail(""); setPassword(""); setMsg(""); }}
            className="btn px-6 py-2 rounded-xl text-sm font-medium text-white"
          >
            Dang xuat
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={mode === "login" ? "Dang nhap" : "Dang ky"}>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        <div className="glass rounded-2xl p-5 space-y-3">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Ho ten"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="password"
              placeholder="Mat khau"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/20"
            />
          </div>
        </div>

        {msg && (
          <p className={`text-sm text-center ${msg.includes("thanh cong") ? "text-emerald-400" : "text-red-400"}`}>
            {msg}
          </p>
        )}

        <button
          type="submit"
          className="w-full btn flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white active:scale-95"
        >
          {mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {mode === "login" ? "Dang nhap" : "Dang ky"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          {mode === "login" ? "Chua co tai khoan? " : "Da co tai khoan? "}
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setMsg(""); }}
            className="text-white font-medium hover:underline"
          >
            {mode === "login" ? "Dang ky" : "Dang nhap"}
          </button>
        </p>
      </form>
    </AppLayout>
  );
}
