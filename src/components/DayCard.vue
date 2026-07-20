<template>
  <div class="glass rounded-2xl p-4 relative overflow-hidden anim-fade" :style="{ animationDelay: index * 0.06 + 's' }">
    <div class="absolute top-0 right-0 w-24 h-24 opacity-[0.04] rounded-full blur-2xl pointer-events-none" :style="{ background: accent }"></div>

    <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-3 relative z-10">
      <div>
        <span class="text-[9px] font-medium uppercase tracking-widest text-zinc-500">Ngày</span>
        <h3 class="font-bold text-base" :style="{ color: accent }">{{ day.day }}</h3>
      </div>
      <button @click="$emit('refresh')" class="btn min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-zinc-400 active:text-white" aria-label="Làm mới">
        <RefreshCw class="w-[16px] h-[16px]" />
      </button>
    </div>

    <div class="mb-3 relative z-10">
      <div class="flex justify-between text-[11px] mb-1">
        <span class="text-zinc-500">Tổng</span>
        <span class="text-white font-semibold tabular-nums">{{ dayCal }} <span class="text-zinc-500 font-normal">kcal</span></span>
      </div>
      <div class="h-1 bg-white/8 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500" :style="{ width: Math.min((dayCal / 1200) * 100, 100) + '%', background: barColor }"></div>
      </div>
    </div>

    <div class="space-y-1.5 relative z-10">
      <MealItem v-for="m in meals" :key="m.type" :meal="m" @refresh="$emit('refresh-meal', m.type)" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MealItem from './MealItem.vue'
import { RefreshCw } from 'lucide-vue-next'

const props = defineProps({
  day: Object, index: Number
})
defineEmits(['refresh', 'refresh-meal'])

const COLORS = { 'Thứ 2': '#f43f5e', 'Thứ 3': '#0ea5e9', 'Thứ 4': '#10b981', 'Thứ 5': '#8b5cf6', 'Thứ 6': '#f59e0b', 'Thứ 7': '#ec4899', 'Chủ Nhật': '#14b8a6' }
const accent = computed(() => COLORS[props.day.day] || '#fff')

const dayCal = computed(() => props.day.breakfast.calories + props.day.lunch.calories + props.day.dinner.calories)

const barColor = computed(() => {
  const p = dayCal.value / 1200
  return p < 0.5 ? 'linear-gradient(90deg, #10b981, #34d399)' : p < 0.85 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #f43f5e, #fb7185)'
})

const meals = computed(() => [
  { type: 'breakfast', label: 'BỮA SÁNG', data: props.day.breakfast, color: '#f59e0b', dot: 'bg-amber-400', card: 'meal-amber', bar: 'bar-amber' },
  { type: 'lunch', label: 'BỮA TRƯA', data: props.day.lunch, color: '#10b981', dot: 'bg-emerald-400', card: 'meal-emerald', bar: 'bar-emerald' },
  { type: 'dinner', label: 'BỮA TỐI', data: props.day.dinner, color: '#8b5cf6', dot: 'bg-violet-400', card: 'meal-violet', bar: 'bar-violet' }
])
</script>
