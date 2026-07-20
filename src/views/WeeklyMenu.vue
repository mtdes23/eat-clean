<template>
  <AppLayout title="Eat Clean Menu">
    <div ref="captureRef">
      <div class="glass rounded-2xl p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-emerald-400 to-violet-400 flex items-center justify-center">
              <Flame class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Tuần này</p>
              <p class="text-lg font-bold tabular-nums">{{ totalCal }} <span class="text-xs font-normal text-zinc-500">kcal</span></p>
            </div>
          </div>
          <div class="flex gap-1.5">
            <div v-for="t in typeTotals" :key="t.key" class="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/5">
              <span class="w-1.5 h-1.5 rounded-full" :class="t.dot"></span>
              <span class="text-zinc-500 text-[10px]">{{ t.short }}</span>
              <span class="text-white font-semibold text-xs tabular-nums">{{ t.cal }}</span>
            </div>
          </div>
        </div>
        <div class="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <div class="h-full rounded-full bar-gradient transition-all duration-700" :style="{ width: Math.min((totalCal / 8400) * 100, 100) + '%' }"></div>
        </div>
      </div>

      <div class="flex gap-2 mb-4" data-ignore>
        <button @click="genWeek" class="btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-1 active:scale-95">
          <RefreshCcw class="w-4 h-4" /> Đổi tuần
        </button>
        <button @click="saveImage" class="btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-1 active:scale-95">
          <Download class="w-4 h-4" /> Lưu ảnh
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-3">
        <DayCard v-for="(d, i) in week" :key="d.day + d.breakfast.id"
          :day="d" :index="i"
          @refresh="refreshDay(i)"
          @refresh-meal="(t) => refreshMeal(i, t)" />
      </div>
    </div>

    <TransitionGroup name="toast" tag="div" class="fixed left-3 right-3 top-4 z-50 max-w-sm mx-auto pointer-events-none" data-ignore>
      <div v-for="t in toasts" :key="t.id"
        class="glass-strong rounded-xl px-4 py-2.5 text-sm text-white flex items-center gap-2.5 shadow-2xl pointer-events-auto">
        <CheckCircle class="w-4 h-4 text-emerald-400 shrink-0" />
        {{ t.msg }}
      </div>
    </TransitionGroup>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { generateWeeklyMenu, breakfasts, lunches, dinners, getRandomItem } from '../data/meals'
import AppLayout from '../components/AppLayout.vue'
import DayCard from '../components/DayCard.vue'
import { RefreshCcw, Download, Flame, CheckCircle } from 'lucide-vue-next'
import * as hti from 'html-to-image'

const week = ref([])
const toasts = ref([])
const captureRef = ref(null)

const totalCal = computed(() =>
  week.value.reduce((s, d) => s + d.breakfast.calories + d.lunch.calories + d.dinner.calories, 0)
)

const typeTotals = computed(() => {
  const keys = ['breakfast', 'lunch', 'dinner']
  const dots = ['bg-amber-400', 'bg-emerald-400', 'bg-violet-400']
  const shorts = ['S', 'T', 'T']
  return keys.map((k, i) => ({
    key: k, dot: dots[i], short: shorts[i],
    cal: week.value.reduce((s, d) => s + d[k].calories, 0)
  }))
})

const toast = (msg) => {
  const id = Date.now()
  toasts.value.push({ id, msg })
  setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 2500)
}

const genWeek = () => { week.value = generateWeeklyMenu(); toast('Đã tạo thực đơn mới') }

const saveImage = async () => {
  const el = captureRef.value?.parentElement
  if (!el) return
  try {
    const url = await hti.toPng(el, {
      backgroundColor: '#000', pixelRatio: 2,
      filter: (n) => !(n.hasAttribute && n.hasAttribute('data-ignore'))
    })
    const a = document.createElement('a')
    a.download = 'eat-clean-menu.png'
    a.href = url; a.click()
    toast('Đã lưu ảnh')
  } catch { toast('Lỗi lưu ảnh') }
}

const refreshDay = (i) => {
  const d = week.value[i]
  week.value[i] = {
    day: d.day,
    breakfast: getRandomItem(breakfasts, d.breakfast.id),
    lunch: getRandomItem(lunches, d.lunch.id),
    dinner: getRandomItem(dinners, d.dinner.id)
  }
}

const refreshMeal = (i, type) => {
  const map = { breakfast: breakfasts, lunch: lunches, dinner: dinners }
  week.value[i][type] = getRandomItem(map[type], week.value[i][type].id)
  week.value = [...week.value]
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('ec-week')
    week.value = saved ? JSON.parse(saved) : generateWeeklyMenu()
  } catch { week.value = generateWeeklyMenu() }
})

watch(week, (v) => localStorage.setItem('ec-week', JSON.stringify(v)), { deep: true })
</script>

<style scoped>
.toast-enter-active { animation: sin 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
.toast-leave-active { animation: sin 0.2s ease reverse; }
@keyframes sin { from { opacity: 0; transform: translateY(-12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>
