<template>
  <div class="glass-card rounded-3xl p-6 relative overflow-hidden group">
    <div class="light-sweep hidden group-hover:block"></div>
    
    <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-20">
      <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
        {{ dayData.day }}
      </h3>
      <button @click="$emit('refresh-day')" class="glass-button p-2 rounded-xl text-zinc-300 hover:text-white group" aria-label="Làm mới ngày">
        <RefreshCw class="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
      </button>
    </div>

    <div class="space-y-4 relative z-20">
      <div v-for="meal in meals" :key="meal.type" @click="$router.push(`/recipe/${meal.data.id}`)" class="bg-white/5 rounded-2xl p-4 border border-white/5 relative overflow-hidden transition-all hover:bg-white/10 group/meal cursor-pointer hover:-translate-y-1">
        <div class="flex justify-between items-start mb-2">
          <span class="text-sm font-semibold tracking-wider text-zinc-400 uppercase">{{ meal.label }}</span>
          <button @click.stop="$emit('refresh-meal', meal.type)" class="text-zinc-500 hover:text-white transition-colors opacity-0 group-hover/meal:opacity-100" aria-label="Đổi món">
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>
        <p class="text-lg font-medium text-white mb-1">{{ meal.data.name }}</p>
        <p class="text-xs text-zinc-400 flex items-center gap-1">
          <Flame class="w-3 h-3 text-orange-400" /> {{ meal.data.calories }} kcal
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RefreshCw, Flame } from 'lucide-vue-next';

const props = defineProps({
  dayData: {
    type: Object,
    required: true
  }
});

defineEmits(['refresh-day', 'refresh-meal']);

const meals = computed(() => [
  { type: 'breakfast', label: 'Bữa Sáng', data: props.dayData.breakfast },
  { type: 'lunch', label: 'Bữa Trưa', data: props.dayData.lunch },
  { type: 'dinner', label: 'Bữa Tối', data: props.dayData.dinner },
]);
</script>
