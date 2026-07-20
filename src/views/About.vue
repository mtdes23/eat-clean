<template>
  <AppLayout title="Giới thiệu">
    <div class="glass rounded-2xl p-6 text-center mb-4">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-400 to-violet-400 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-emerald-500/20">
        🥗
      </div>
      <h2 class="text-xl font-bold mb-1">Eat Clean Menu</h2>
      <p class="text-zinc-500 text-sm mb-4">Phiên bản 1.0</p>
      <p class="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
        Ứng dụng gợi ý thực đơn Eat Clean hàng tuần với 27 món ăn healthy, giúp bạn dễ dàng lên kế hoạch bữa ăn lành mạnh.
      </p>
    </div>

    <div class="glass rounded-2xl p-4 space-y-3">
      <div class="flex items-center justify-between py-1">
        <span class="text-sm text-zinc-400">Tổng số món ăn</span>
        <span class="text-sm font-semibold">27</span>
      </div>
      <div class="border-t border-white/5"></div>
      <div class="flex items-center justify-between py-1">
        <span class="text-sm text-zinc-400">Bữa sáng</span>
        <span class="text-sm font-semibold text-amber-400">9</span>
      </div>
      <div class="border-t border-white/5"></div>
      <div class="flex items-center justify-between py-1">
        <span class="text-sm text-zinc-400">Bữa trưa</span>
        <span class="text-sm font-semibold text-emerald-400">10</span>
      </div>
      <div class="border-t border-white/5"></div>
      <div class="flex items-center justify-between py-1">
        <span class="text-sm text-zinc-400">Bữa tối</span>
        <span class="text-sm font-semibold text-violet-400">8</span>
      </div>
      <div class="border-t border-white/5"></div>
      <div class="flex items-center justify-between py-1">
        <span class="text-sm text-zinc-400">Lượng calo mục tiêu / ngày</span>
        <span class="text-sm font-semibold">1.200 kcal</span>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>
