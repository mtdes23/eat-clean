<template>
  <div class="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative">
    <div ref="captureRef">
      <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 relative z-10">
        <div class="text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-3 tracking-tight">
            Eat Clean Menu
          </h1>
          <p class="text-zinc-500 text-sm max-w-xl">
            Thực đơn eat clean ngẫu nhiên nguyên tuần &mdash; nhấp vào món để xem công thức
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3" data-html2canvas-ignore>
          <button @click="downloadImage" class="glass-button flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-white group cursor-pointer hover:border-white/40">
            <Download class="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            Lưu Ảnh
          </button>
          <button @click="generateNewWeek" class="glass-button flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-white group cursor-pointer hover:border-white/40">
            <RefreshCcw class="w-4 h-4 group-hover:-rotate-180 transition-transform duration-700" />
            Đổi Cả Tuần
          </button>
        </div>
      </div>

      <div class="glass-card-strong rounded-3xl p-5 mb-8 relative z-10" data-html2canvas-ignore>
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-400 to-violet-400 flex items-center justify-center">
              <Flame class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="text-xs text-zinc-500 font-medium uppercase tracking-wider">Tuần này</p>
              <p class="text-2xl font-bold tabular-nums">{{ totalWeekCalories }} <span class="text-sm font-normal text-zinc-400">kcal</span></p>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 text-xs">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span class="text-zinc-400">Sáng</span>
              <span class="text-white font-semibold tabular-nums">{{ totalTypeCalories.breakfast }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="text-zinc-400">Trưa</span>
              <span class="text-white font-semibold tabular-nums">{{ totalTypeCalories.lunch }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5">
              <span class="w-2 h-2 rounded-full bg-violet-400"></span>
              <span class="text-zinc-400">Tối</span>
              <span class="text-white font-semibold tabular-nums">{{ totalTypeCalories.dinner }}</span>
            </div>
          </div>
        </div>
        <div class="mt-3 h-2 bg-white/8 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700 bar-gradient" :style="{ width: Math.min((totalWeekCalories / WEEK_TARGET) * 100, 100) + '%' }"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-5 relative z-10">
        <DayCard
          v-for="(day, index) in weekPlan"
          :key="day.day + '-' + (day.breakfast?.id || index)"
          :day-data="day"
          class="animate-fade-up"
          :style="{ animationDelay: index * 0.08 + 's', animationFillMode: 'backwards' }"
          @refresh-day="refreshDay(index)"
          @refresh-meal="(mealType) => refreshMeal(index, mealType)"
        />
      </div>

      <div class="mt-16 py-6 border-t border-white/8 text-center text-zinc-600 text-xs relative z-10" data-html2canvas-ignore>
        <p class="mb-1">Designed with <span class="text-white hover:text-pink-400 font-semibold transition-colors duration-300">mtdes23</span></p>
        <a href="https://www.mtdes23.id.vn" target="_blank" class="hover:text-zinc-400 tracking-wide transition-colors duration-300">www.mtdes23.id.vn</a>
      </div>
    </div>

    <TransitionGroup name="toast" tag="div" class="fixed top-4 right-4 z-50 space-y-2" data-html2canvas-ignore>
      <div v-for="toast in toasts" :key="toast.id"
        class="glass-card-strong rounded-2xl px-5 py-3 text-sm text-white flex items-center gap-3 shadow-2xl min-w-[200px]">
        <CheckCircle v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>

    <Transition name="fab">
      <button v-if="showScrollTop" @click="scrollToTop"
        class="fixed bottom-6 right-6 z-40 glass-button p-3 rounded-full text-zinc-400 hover:text-white hover:border-white/40 shadow-2xl cursor-pointer"
        data-html2canvas-ignore aria-label="Lên đầu trang">
        <ChevronUp class="w-5 h-5" />
      </button>
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
const weekPlan = ref([]);
const captureRef = ref(null);
const toasts = ref([]);
const showScrollTop = ref(false);

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
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 2800);
};

const downloadImage = async () => {
  if (!captureRef.value) return;
  try {
    const dataUrl = await htmlToImage.toPng(captureRef.value, {
      backgroundColor: '#09090b',
      pixelRatio: 2,
      filter: (node) => !(node.hasAttribute && node.hasAttribute('data-html2canvas-ignore'))
    });
    const link = document.createElement('a');
    link.download = 'thuc-don-eat-clean.png';
    link.href = dataUrl;
    link.click();
    showToast('Đã lưu ảnh thành công!');
  } catch (error) {
    showToast('Lỗi khi lưu ảnh', 'error');
  }
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

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 600;
};

onMounted(() => {
  const savedMenu = localStorage.getItem('eatCleanWeeklyMenu');
  if (savedMenu) {
    try { weekPlan.value = JSON.parse(savedMenu); }
    catch { generateNewWeek(); }
  } else {
    generateNewWeek();
  }
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(weekPlan, (newVal) => {
  localStorage.setItem('eatCleanWeeklyMenu', JSON.stringify(newVal));
}, { deep: true });
</script>

<style scoped>
.toast-enter-active { animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.toast-leave-active { animation: slideOut 0.25s ease forwards; }
@keyframes slideIn {
  from { opacity: 0; transform: translateX(24px) scale(0.95); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes slideOut {
  to { opacity: 0; transform: translateX(24px) scale(0.95); }
}
.fab-enter-active { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.fab-leave-active { animation: scaleIn 0.2s ease reverse; }
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
</style>
