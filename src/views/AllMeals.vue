<template>
  <AppLayout title="Tất cả Món ăn">
    <div class="space-y-5">
      <section v-for="cat in categories" :key="cat.key">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2 h-2 rounded-full" :class="cat.dot"></span>
          <h2 class="text-sm font-bold uppercase tracking-wide" :style="{ color: cat.color }">{{ cat.label }}</h2>
        </div>
        <div class="space-y-2">
          <div v-for="m in cat.meals" :key="m.id" @click="$router.push('/recipe/' + m.id)"
            role="button" :tabindex="0"
            @keydown.enter="$router.push('/recipe/' + m.id)"
            class="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 active:scale-[0.98]"
            :class="cat.card">
            <div class="w-1.5 h-12 rounded-full" :style="{ background: cat.color }"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white/90 truncate">{{ m.name }}</p>
              <p class="text-[11px] mt-0.5 flex items-center gap-3">
                <span :style="{ color: cat.color }">
                  <Flame class="w-3 h-3 inline -mt-0.5" /> {{ m.calories }} kcal
                </span>
              </p>
            </div>
            <ChevronRight class="w-4 h-4 text-zinc-600 shrink-0" />
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { breakfasts, lunches, dinners } from '../data/meals'
import AppLayout from '../components/AppLayout.vue'
import { Flame, ChevronRight } from 'lucide-vue-next'

const categories = [
  { key: 'breakfast', label: 'Bữa Sáng', color: '#f59e0b', dot: 'bg-amber-400', card: 'meal-amber', meals: breakfasts },
  { key: 'lunch', label: 'Bữa Trưa', color: '#10b981', dot: 'bg-emerald-400', card: 'meal-emerald', meals: lunches },
  { key: 'dinner', label: 'Bữa Tối', color: '#8b5cf6', dot: 'bg-violet-400', card: 'meal-violet', meals: dinners }
]
</script>
