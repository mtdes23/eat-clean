<template>
  <div class="glass-card rounded-3xl p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.25),0_20px_40px_rgba(0,0,0,0.35)]">
    <div class="absolute top-0 right-0 w-32 h-32 opacity-[0.04] rounded-full blur-2xl transition-all duration-700 group-hover:opacity-[0.08] group-hover:scale-150 pointer-events-none" :style="{ background: dayAccent }"></div>
    <div class="light-sweep hidden group-hover:block"></div>

    <div class="flex justify-between items-center mb-5 border-b border-white/10 pb-4 relative z-20">
      <div>
        <span class="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Ngày</span>
        <h3 class="text-xl font-bold" :style="{ color: dayAccent }">{{ dayData.day }}</h3>
      </div>
      <button @click="$emit('refresh-day')" class="glass-button p-2 rounded-xl text-zinc-400 hover:text-white group/btn cursor-pointer transition-all duration-300" aria-label="Làm mới ngày">
        <RefreshCw class="w-4 h-4 transition-all duration-500 group-hover/btn:rotate-180" />
      </button>
    </div>

    <div class="mb-4 relative z-20">
      <div class="flex justify-between items-center text-xs mb-1.5">
        <span class="text-zinc-500">Tổng calo</span>
        <span class="text-white font-semibold tabular-nums">{{ dailyCalories }} <span class="text-zinc-500 font-normal">kcal</span></span>
      </div>
      <div class="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700 ease-out" :style="{ width: Math.min((dailyCalories / DAILY_TARGET) * 100, 100) + '%', background: dailyBarColor }"></div>
      </div>
    </div>

    <div class="space-y-2.5 relative z-20">
      <div v-for="meal in meals" :key="meal.type"
        @click="$router.push(`/recipe/${meal.data.id}`)"
        :class="['rounded-2xl p-4 border border-white/5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5', meal.cardClass]">
        <div class="flex justify-between items-start mb-1.5">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full shrink-0" :class="meal.dotClass"></div>
            <span class="text-[10px] font-semibold uppercase tracking-[0.15em]" :class="meal.labelClass">{{ meal.label }}</span>
          </div>
          <button @click.stop="$emit('refresh-meal', meal.type)" class="text-zinc-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100" aria-label="Đổi món">
            <RefreshCw class="w-3.5 h-3.5 transition-transform duration-500 hover:rotate-180" />
          </button>
        </div>
        <p class="text-sm font-medium text-white/90 mb-2 leading-snug line-clamp-2">{{ meal.data.name }}</p>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1 text-xs font-medium" :class="meal.labelClass">
            <Flame class="w-3 h-3" /> {{ meal.data.calories }} kcal
          </div>
          <div class="w-16 h-1 bg-white/8 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" :class="meal.barClass" :style="{ width: Math.min((meal.data.calories / meal.maxCal) * 100, 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RefreshCw, Flame } from 'lucide-vue-next';

const DAILY_TARGET = 1200;
const MEAL_CONFIG = {
  breakfast: { maxCal: 400, label: 'Bữa Sáng', dotClass: 'bg-amber-400', labelClass: 'text-amber-400', cardClass: 'meal-card-amber', barClass: 'bar-amber' },
  lunch: { maxCal: 550, label: 'Bữa Trưa', dotClass: 'bg-emerald-400', labelClass: 'text-emerald-400', cardClass: 'meal-card-emerald', barClass: 'bar-emerald' },
  dinner: { maxCal: 400, label: 'Bữa Tối', dotClass: 'bg-violet-400', labelClass: 'text-violet-400', cardClass: 'meal-card-violet', barClass: 'bar-violet' },
};

const DAY_COLORS = {
  'Thứ 2': '#f43f5e', 'Thứ 3': '#0ea5e9', 'Thứ 4': '#10b981',
  'Thứ 5': '#8b5cf6', 'Thứ 6': '#f59e0b', 'Thứ 7': '#ec4899', 'Chủ Nhật': '#14b8a6'
};

const props = defineProps({
  dayData: { type: Object, required: true }
});

defineEmits(['refresh-day', 'refresh-meal']);

const dayAccent = computed(() => DAY_COLORS[props.dayData.day] || '#ffffff');

const dailyCalories = computed(() =>
  props.dayData.breakfast.calories + props.dayData.lunch.calories + props.dayData.dinner.calories
);

const dailyBarColor = computed(() => {
  const pct = dailyCalories.value / DAILY_TARGET;
  if (pct < 0.5) return 'linear-gradient(90deg, #10b981, #34d399)';
  if (pct < 0.85) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
  return 'linear-gradient(90deg, #f43f5e, #fb7185)';
});

const meals = computed(() =>
  ['breakfast', 'lunch', 'dinner'].map(type => ({
    type,
    data: props.dayData[type],
    ...MEAL_CONFIG[type]
  }))
);
</script>
