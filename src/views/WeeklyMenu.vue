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
          <div class="h-full rounded-full bar-gradient transition-all duration-700" :style="{ width: Math.min((totalCal / (calorieTarget * 7)) * 100, 100) + '%' }"></div>
        </div>
        <div class="flex items-center justify-between mt-2">
          <span class="text-[10px] text-zinc-500">Mục tiêu: {{ (calorieTarget * 7).toLocaleString() }} kcal/tuần</span>
          <button @click="showCalorieSettings = true" class="text-[10px] text-zinc-400 underline">Đổi mục tiêu</button>
        </div>
      </div>

      <div class="flex gap-2 mb-4" data-ignore>
        <button @click="genWeek" class="btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-1 active:scale-95">
          <RefreshCcw class="w-4 h-4" /> Đổi tuần
        </button>
        <button @click="saveImage" class="btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-1 active:scale-95">
          <Download class="w-4 h-4" /> Lưu ảnh
        </button>
        <button @click="$router.push('/shopping')" class="btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-1 active:scale-95">
          <ShoppingCart class="w-4 h-4" /> Mua sắm
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-3">
        <DayCard v-for="(d, i) in week" :key="d.day + d.breakfast.id"
          :day="d" :index="i"
          @refresh="refreshDay(i)"
          @refresh-meal="(t) => refreshMeal(i, t)"
          @toggle-lock="(t) => toggleLock(i, t)" />
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCalorieSettings" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showCalorieSettings = false">
          <div class="absolute inset-0 bg-black/60"></div>
          <div class="glass-strong rounded-2xl p-6 w-full max-w-sm relative z-10">
            <h3 class="font-bold text-lg mb-4">Mục tiêu calo hàng ngày</h3>
            <div class="space-y-3">
              <div v-for="opt in calorieOptions" :key="opt" @click="calorieTarget = opt; showCalorieSettings = false"
                class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
                :class="calorieTarget === opt ? 'bg-white/15 border border-white/20' : 'bg-white/5 border border-transparent hover:bg-white/10'">
                <span class="text-sm font-medium">{{ opt.toLocaleString() }} kcal/ngày</span>
                <Check v-if="calorieTarget === opt" class="w-4 h-4 text-emerald-400" />
              </div>
              <div class="flex items-center gap-2 pt-2">
                <input v-model.number="customCalorie" type="number" min="500" max="5000" step="50"
                  placeholder="Tùy chỉnh" class="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/30" />
                <button @click="if(customCalorie >= 500 && customCalorie <= 5000) { calorieTarget = customCalorie; showCalorieSettings = false }"
                  class="btn px-4 py-2 rounded-xl text-sm font-medium text-white">Áp dụng</button>
              </div>
            </div>
            <button @click="showCalorieSettings = false" class="absolute top-3 right-3 text-zinc-400 hover:text-white">
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

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
import { generateWeeklyMenu, breakfasts, lunches, dinners, getRandomItemWithFavorites } from '../data/meals'
import { useStore } from '../composables/useStore'
import AppLayout from '../components/AppLayout.vue'
import DayCard from '../components/DayCard.vue'
import { RefreshCcw, Download, Flame, CheckCircle, ShoppingCart, X, Check } from 'lucide-vue-next'
import * as hti from 'html-to-image'

const { calorieTarget, favorites, locked } = useStore()

const week = ref([])
const toasts = ref([])
const captureRef = ref(null)
const showCalorieSettings = ref(false)
const customCalorie = ref(1200)
const calorieOptions = [1000, 1200, 1500, 1800, 2000]

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

const genWeek = () => { week.value = generateWeeklyMenu(locked.value, favorites.value); toast('Đã tạo thực đơn mới') }

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
    breakfast: getRandomItemWithFavorites(breakfasts, favorites.value, d.breakfast.id),
    lunch: getRandomItemWithFavorites(lunches, favorites.value, d.lunch.id),
    dinner: getRandomItemWithFavorites(dinners, favorites.value, d.dinner.id)
  }
}

const refreshMeal = (i, type) => {
  const map = { breakfast: breakfasts, lunch: lunches, dinner: dinners }
  week.value[i][type] = getRandomItemWithFavorites(map[type], favorites.value, week.value[i][type].id)
  week.value = [...week.value]
}

const toggleLock = (dayIndex, type) => {
  const meal = week.value[dayIndex][type]
  if (locked.value[dayIndex]?.[type]?.id === meal.id) {
    if (!locked.value[dayIndex]) locked.value[dayIndex] = {}
    delete locked.value[dayIndex][type]
    locked.value = { ...locked.value }
    toast('Đã bỏ khóa món')
  } else {
    if (!locked.value[dayIndex]) locked.value[dayIndex] = {}
    locked.value[dayIndex][type] = meal
    locked.value = { ...locked.value }
    toast('Đã khóa món này')
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('ec-week')
    week.value = saved ? JSON.parse(saved) : generateWeeklyMenu(locked.value, favorites.value)
  } catch { week.value = generateWeeklyMenu(locked.value, favorites.value) }
})

watch(week, (v) => localStorage.setItem('ec-week', JSON.stringify(v)), { deep: true })
</script>

<style scoped>
.toast-enter-active { animation: sin 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
.toast-leave-active { animation: sin 0.2s ease reverse; }
@keyframes sin { from { opacity: 0; transform: translateY(-12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
