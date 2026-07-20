<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-40" style="background: linear-gradient(180deg, #000 60%, transparent)">
      <div class="flex items-center gap-3 px-4 pb-2 pt-safe">
        <button @click="$router.back()" class="btn min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-zinc-400 active:text-white" aria-label="Quay lại">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-lg font-bold tracking-tight truncate">{{ meal?.name }}</h1>
      </div>
    </header>

    <main class="flex-1 px-4 pb-8" v-if="meal">
      <div class="glass rounded-2xl p-4 mb-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold" :class="typeInfo.bg" :style="{ background: typeInfo.color + '22', color: typeInfo.color }">
          {{ typeInfo.icon }}
        </div>
        <div class="flex gap-4 flex-1 flex-wrap">
          <div>
            <span class="text-[9px] text-zinc-500 font-medium uppercase tracking-widest">{{ typeInfo.label }}</span>
            <p class="text-sm font-semibold mt-0.5" :style="{ color: typeInfo.color }">
              <Flame class="w-3.5 h-3.5 inline -mt-0.5" /> {{ meal.calories }} kcal
            </p>
          </div>
          <div>
            <span class="text-[9px] text-zinc-500 font-medium uppercase tracking-widest">Thời gian</span>
            <p class="text-sm font-semibold text-white/80 mt-0.5">
              <Clock class="w-3.5 h-3.5 inline -mt-0.5" /> {{ recipe.time }}
            </p>
          </div>
          <div>
            <span class="text-[9px] text-zinc-500 font-medium uppercase tracking-widest">Khẩu phần</span>
            <p class="text-sm font-semibold text-white/80 mt-0.5">
              <Users class="w-3.5 h-3.5 inline -mt-0.5" /> {{ recipe.servings }}
            </p>
          </div>
        </div>
      </div>

      <section class="mb-6">
        <h2 class="font-bold text-base mb-3 flex items-center gap-2">
          <FileText class="w-4 h-4" :style="{ color: typeInfo.color }" />
          Nguyên liệu
        </h2>
        <div class="glass rounded-2xl p-4 space-y-1">
          <div v-for="(ing, i) in recipe.ingredients" :key="i"
            @click="toggleIng(i)"
            role="button" :tabindex="0"
            @keydown.enter="toggleIng(i)"
            class="flex items-center gap-3 px-2 py-1.5 rounded-xl cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99]">
            <div class="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200"
              :class="ingChecked(i) ? 'border-white/80 bg-white/20' : 'border-zinc-600'">
              <Check v-if="ingChecked(i)" class="w-3 h-3 text-white" />
            </div>
            <span class="text-sm transition-all duration-200" :class="ingChecked(i) ? 'text-zinc-500 line-through' : 'text-white/90'">
              {{ ing }}
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-bold text-base mb-3 flex items-center gap-2">
          <ListOrdered class="w-4 h-4" :style="{ color: typeInfo.color }" />
          Cách làm
        </h2>
        <div class="glass rounded-2xl p-4 space-y-3">
          <div v-for="(step, i) in recipe.steps" :key="i"
            @click="toggleStep(i)"
            role="button" :tabindex="0"
            @keydown.enter="toggleStep(i)"
            class="flex gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99]">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all duration-200"
              :class="stepChecked(i) ? 'bg-white/20 text-white/60' : 'text-white'"
              :style="stepChecked(i) ? {} : { background: typeInfo.color + '33', color: typeInfo.color }">
              {{ stepChecked(i) ? '✓' : i + 1 }}
            </div>
            <p class="text-sm transition-all duration-200" :class="stepChecked(i) ? 'text-zinc-500 line-through' : 'text-white/85 leading-relaxed'">
              {{ step }}
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { breakfasts, lunches, dinners } from '../data/meals'
import recipes from '../data/recipes'
import { ArrowLeft, Flame, Clock, Users, FileText, ListOrdered, Check } from 'lucide-vue-next'

const route = useRoute()
const checkedIng = ref([])
const checkedStep = ref([])

const allMeals = [...breakfasts, ...lunches, ...dinners]
const meal = computed(() => allMeals.find(m => m.id === route.params.id))

const recipe = computed(() => recipes[route.params.id] || { time: '—', servings: '—', ingredients: [], steps: [] })

const typeInfo = computed(() => {
  if (breakfasts.some(m => m.id === route.params.id)) return { color: '#f59e0b', label: 'BỮA SÁNG', icon: '🌅', bg: 'bg-amber-400/10' }
  if (lunches.some(m => m.id === route.params.id)) return { color: '#10b981', label: 'BỮA TRƯA', icon: '☀️', bg: 'bg-emerald-400/10' }
  return { color: '#8b5cf6', label: 'BỮA TỐI', icon: '🌙', bg: 'bg-violet-400/10' }
})

const ingChecked = (i) => checkedIng.value.includes(i)
const stepChecked = (i) => checkedStep.value.includes(i)
const toggleIng = (i) => { checkedIng.value = checkedIng.value.includes(i) ? checkedIng.value.filter(x => x !== i) : [...checkedIng.value, i] }
const toggleStep = (i) => { checkedStep.value = checkedStep.value.includes(i) ? checkedStep.value.filter(x => x !== i) : [...checkedStep.value, i] }
</script>

<style scoped>
.pt-safe { padding-top: env(safe-area-inset-top, 12px); }
</style>
