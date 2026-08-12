<template>
  <div @click="$router.push('/recipe/' + meal.data.id)" role="button" :tabindex="0"
    @keydown.enter="$router.push('/recipe/' + meal.data.id)"
    class="flex items-center gap-3 p-3 rounded-xl border border-white/5 cursor-pointer transition-all duration-200 active:scale-[0.98]"
    :class="meal.card">
    <div class="w-1 h-10 rounded-full shrink-0" :style="{ background: meal.color }"></div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5 mb-0.5">
        <span class="w-1.5 h-1.5 rounded-full" :class="meal.dot"></span>
        <span class="text-[9px] font-semibold uppercase tracking-wider" :style="{ color: meal.color }">{{ meal.label }}</span>
        <Lock v-if="locked" class="w-2.5 h-2.5 text-zinc-500" />
      </div>
      <p class="text-sm font-medium text-white/90 truncate">{{ meal.data.name }}</p>
      <div class="flex items-center gap-2 mt-0.5">
        <span class="text-[11px] font-medium" :style="{ color: meal.color }">
          <Flame class="w-2.5 h-2.5 inline -mt-0.5" /> {{ meal.data.calories }} kcal
        </span>
        <div class="flex-1 max-w-[60px] h-1 bg-white/8 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all" :class="meal.bar" :style="{ width: Math.min((meal.data.calories / 500) * 100, 100) + '%' }"></div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-1 shrink-0" @click.stop>
      <button @click="$emit('toggle-favorite')"
        class="btn min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg transition-all"
        :class="favorited ? 'text-amber-400' : 'text-zinc-600 active:text-amber-400'" aria-label="Yêu thích">
        <Heart class="w-3.5 h-3.5" :fill="favorited ? 'currentColor' : 'none'" />
      </button>
      <button @click="$emit('toggle-lock')"
        class="btn min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg transition-all"
        :class="locked ? 'text-emerald-400' : 'text-zinc-600 active:text-emerald-400'" aria-label="Khóa">
        <Lock class="w-3.5 h-3.5" />
      </button>
    </div>
    <button @click.stop="$emit('refresh')" class="btn min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-zinc-500 active:text-white shrink-0" aria-label="Đổi">
      <RefreshCw class="w-[14px] h-[14px]" />
    </button>
  </div>
</template>

<script setup>
import { RefreshCw, Flame, Heart, Lock } from 'lucide-vue-next'

defineProps({ meal: Object, locked: Boolean, favorited: Boolean })
defineEmits(['refresh', 'toggle-favorite', 'toggle-lock'])
</script>
