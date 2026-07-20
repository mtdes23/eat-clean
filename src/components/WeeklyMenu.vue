<template>
  <div class="w-full max-w-7xl mx-auto py-6 md:py-10 px-3 sm:px-6 lg:px-8 relative"
    @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
    @touchcancel="onTouchEnd">
    <div ref="captureRef">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 gap-5 relative z-10">
        <div class="text-center md:text-left">
          <h1 class="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-2 tracking-tight">
            Eat Clean Menu
          </h1>
          <p class="text-zinc-500 text-xs md:text-sm max-w-xl">
            Thực đơn eat clean ngẫu nhiên nguyên tuần &mdash; nhấp vào món để xem công thức
          </p>
        </div>
        <div class="flex flex-row gap-2.5 w-full sm:w-auto" data-html2canvas-ignore>
          <button @click="downloadImage" class="glass-button flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-sm font-medium text-white cursor-pointer active:scale-95 flex-1 sm:flex-initial">
            <Download class="w-[18px] h-[18px]" />
            <span class="max-sm:hidden sm:inline">Lưu Ảnh</span>
          </button>
          <button @click="generateNewWeek" class="glass-button flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-sm font-medium text-white cursor-pointer active:scale-95 flex-1 sm:flex-initial">
            <RefreshCcw class="w-[18px] h-[18px]" />
            <span class="max-sm:hidden sm:inline">Đổi Tuần</span>
          </button>
        </div>
      </div>

      <div class="glass-card-strong rounded-2xl md:rounded-3xl p-4 md:p-5 mb-6 md:mb-8 relative z-10" data-html2canvas-ignore>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="w-10 h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-400 to-violet-400 flex items-center justify-center shrink-0">
              <Flame class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-wider">Tuần này</p>
              <p class="text-xl md:text-2xl font-bold tabular-nums">{{ totalWeekCalories }} <span class="text-xs md:text-sm font-normal text-zinc-400">kcal</span></p>
            </div>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <div class="flex-1 sm:flex-initial flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-xl bg-white/5 min-w-0">
              <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
              <span class="text-zinc-500 text-[11px] md:text-xs">S</span>
              <span class="text-white font-semibold tabular-nums text-xs md:text-sm">{{ totalTypeCalories.breakfast }}</span>
            </div>
            <div class="flex-1 sm:flex-initial flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-xl bg-white/5 min-w-0">
              <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <span class="text-zinc-500 text-[11px] md:text-xs">T</span>
              <span class="text-white font-semibold tabular-nums text-xs md:text-sm">{{ totalTypeCalories.lunch }}</span>
            </div>
            <div class="flex-1 sm:flex-initial flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-xl bg-white/5 min-w-0">
              <span class="w-2 h-2 rounded-full bg-violet-400 shrink-0"></span>
              <span class="text-zinc-500 text-[11px] md:text-xs">T</span>
              <span class="text-white font-semibold tabular-nums text-xs md:text-sm">{{ totalTypeCalories.dinner }}</span>
            </div>
          </div>
        </div>
        <div class="mt-3 h-[6px] md:h-2 bg-white/8 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700 bar-gradient" :style="{ width: Math.min((totalWeekCalories / WEEK_TARGET) * 100, 100) + '%' }"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-3 md:gap-5 relative z-10">
        <DayCard
          v-for="(day, index) in weekPlan"
          :key="day.day + '-' + (day.breakfast?.id || index)"
          :day-data="day"
          class="animate-fade-up"
          :style="{ animationDelay: index * 0.06 + 's', animationFillMode: 'backwards' }"
          @refresh-day="refreshDay(index)"
          @refresh-meal="(mealType) => refreshMeal(index, mealType)"
        />
      </div>

      <div class="mt-12 md:mt-16 py-5 md:py-6 border-t border-white/8 text-center text-zinc-600 text-[11px] md:text-xs relative z-10" data-html2canvas-ignore>
        <p class="mb-1">Designed with <span class="text-white font-semibold">mtdes23</span></p>
        <a href="https://www.mtdes23.id.vn" target="_blank" class="hover:text-zinc-400 tracking-wide transition-colors">www.mtdes23.id.vn</a>
      </div>
    </div>

    <TransitionGroup name="toast" tag="div" class="fixed left-3 right-3 sm:left-auto sm:right-4 top-4 z-50 space-y-2 max-w-[360px] mx-auto sm:mx-0" data-html2canvas-ignore>
      <div v-for="toast in toasts" :key="toast.id"
        class="glass-card-strong rounded-2xl px-4 md:px-5 py-3 text-sm text-white flex items-center gap-3 shadow-2xl">
        <CheckCircle v-if="toast.type === 'success'" class="w-[18px] h-[18px] text-emerald-400 shrink-0" />
        <span class="text-[13px] md:text-sm">{{ toast.message }}</span>
      </div>
    </TransitionGroup>

    <Transition name="fab">
      <button v-if="showScrollTop" @click="scrollToTop"
        class="fixed bottom-6 right-4 md:right-6 z-40 glass-button min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full text-zinc-400 hover:text-white active:text-white shadow-2xl cursor-pointer active:scale-90"
        data-html2canvas-ignore aria-label="Lên đầu trang">
        <ChevronUp class="w-[22px] h-[22px]" />
      </button>
    </Transition>

    <Transition name="pull">
      <div v-if="pulling" class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-20 pointer-events-none" data-html2canvas-ignore>
        <div class="glass-card-strong rounded-full px-5 py-2 shadow-2xl flex items-center gap-3" :style="{ opacity: pullProgress }">
          <RefreshCcw class="w-4 h-4 text-white transition-transform duration-300" :class="{ 'animate-spin': pullReady }" />
          <span class="text-xs text-zinc-300">{{ pullReady ? 'Thả để làm mới' : 'Kéo xuống để làm mới' }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { generateWeeklyMenu, breakfasts, lunches, dinners, getRandomItem } from '../data/meals';
import DayCard from './DayCard.vue';
import { RefreshCcw, Download, Flame, CheckCircle, ChevronUp } from 'lucide-vue-next';
import * as htmlToImage from 'html-to-image';

const WEEK_TARGET = 8400;
const PULL_THRESHOLD = 60;
const weekPlan = ref([]);
const captureRef = ref(null);
const toasts = ref([]);
const showScrollTop = ref(false);
const pulling = ref(false);
const pullProgress = ref(0);
const pullReady = ref(false);
let pullStartY = 0;
let pullCurrentY = 0;

const totalWeekCalories = computed(() =>
  weekPlan.value.reduce((sum, day) =>
    sum + day.breakfast.calories + day.lunch.calories + day.dinner.calories, 0
  )
);

const totalTypeCalories = computed(() => {
  const totals = { breakfast: 0, lunch: 0, dinner: 0 };
  weekPlan.value.forEach(day => {
    totals.breakfast += day.breakfast.calories;
    totals.lunch += day.lunch.calories;
    totals.dinner += day.dinner.calories;
  });
  return totals;
});

const showToast = (message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 2800);
};

const downloadImage = async () => {
  if (!captureRef.value) return;
  try {
    const dataUrl = await htmlToImage.toPng(captureRef.value, {
      backgroundColor: '#09090b', pixelRatio: 2,
      filter: (node) => !(node.hasAttribute && node.hasAttribute('data-html2canvas-ignore'))
    });
    const link = document.createElement('a');
    link.download = 'thuc-don-eat-clean.png';
    link.href = dataUrl;
    link.click();
    showToast('Đã lưu ảnh thành công!');
  } catch { showToast('Lỗi khi lưu ảnh'); }
};

const generateNewWeek = () => {
  weekPlan.value = generateWeeklyMenu();
  showToast('Đã tạo thực đơn mới!');
};

const refreshDay = (dayIndex) => {
  weekPlan.value[dayIndex] = {
    day: weekPlan.value[dayIndex].day,
    breakfast: getRandomItem(breakfasts, weekPlan.value[dayIndex].breakfast.id),
    lunch: getRandomItem(lunches, weekPlan.value[dayIndex].lunch.id),
    dinner: getRandomItem(dinners, weekPlan.value[dayIndex].dinner.id)
  };
};

const mealDataMap = { breakfast: breakfasts, lunch: lunches, dinner: dinners };
const refreshMeal = (dayIndex, mealType) => {
  const currentMealId = weekPlan.value[dayIndex][mealType].id;
  weekPlan.value[dayIndex][mealType] = getRandomItem(mealDataMap[mealType], currentMealId);
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const onTouchStart = (e) => {
  if (window.scrollY > 0) return;
  pullStartY = e.touches[0].clientY;
  pulling.value = true;
  pullReady.value = false;
};

const onTouchMove = (e) => {
  if (!pulling.value) return;
  pullCurrentY = e.touches[0].clientY;
  const dist = Math.max(0, (pullCurrentY - pullStartY) * 0.4);
  pullProgress.value = Math.min(dist / PULL_THRESHOLD, 1);
  pullReady.value = dist >= PULL_THRESHOLD;
};

const onTouchEnd = () => {
  if (!pulling.value) return;
  if (pullReady.value) generateNewWeek();
  pulling.value = false;
  pullProgress.value = 0;
  pullReady.value = false;
};

const handleScroll = () => { showScrollTop.value = window.scrollY > 600; };

onMounted(() => {
  const savedMenu = localStorage.getItem('eatCleanWeeklyMenu');
  if (savedMenu) { try { weekPlan.value = JSON.parse(savedMenu); } catch { generateNewWeek(); } }
  else { generateNewWeek(); }
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll));

watch(weekPlan, (newVal) => {
  localStorage.setItem('eatCleanWeeklyMenu', JSON.stringify(newVal));
}, { deep: true });
</script>

<style scoped>
.toast-enter-active { animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.toast-leave-active { animation: slideOut 0.25s ease forwards; }
@keyframes slideIn { from { opacity: 0; transform: translateX(24px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
@keyframes slideOut { to { opacity: 0; transform: translateX(24px) scale(0.95); } }
.fab-enter-active { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.fab-leave-active { animation: scaleIn 0.2s ease reverse; }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
.pull-enter-active { animation: fadeIn 0.2s ease; }
.pull-leave-active { animation: fadeIn 0.15s ease reverse; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
