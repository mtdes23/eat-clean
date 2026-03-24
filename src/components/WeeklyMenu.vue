<template>
  <div class="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative z-10">
      <div class="text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-4 tracking-tight">
          Eat Clean Menu
        </h1>
        <p class="text-zinc-400 text-lg max-w-xl">
          Thực đơn eat clean ngẫu nhiên nguyên tuần siêu ngon và đủ dinh dưỡng, nhấp vào món ăn đó sẽ có cách làm giúp chị em luôn rạng rỡ! ✨
        </p>
      </div>
      <button @click="generateNewWeek" class="glass-button flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-white group cursor-pointer hover:border-white/40">
        <RefreshCcw class="w-5 h-5 group-hover:-rotate-180 transition-transform duration-700" />
        Đổi Mới Cả Tuần
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
      <DayCard 
        v-for="(day, index) in weekPlan" 
        :key="day.day" 
        :day-data="day" 
        @refresh-day="refreshDay(index)"
        @refresh-meal="(mealType) => refreshMeal(index, mealType)"
      />
    </div>
    
    <!-- Footer -->
    <div class="mt-20 py-8 border-t border-white/10 text-center text-zinc-500 text-sm relative z-10">
      <p class="mb-2">Designed by <span class="text-white hover:text-pink-400 font-semibold transition-colors duration-300">mtdes23</span></p>
      <a href="https://www.mtdes23.id.vn" target="_blank" class="hover:text-zinc-300 tracking-wide transition-colors duration-300">www.mtdes23.id.vn</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { generateWeeklyMenu, breakfasts, lunches, dinners, getRandomItem } from '../data/meals';
import DayCard from './DayCard.vue';
import { RefreshCcw } from 'lucide-vue-next';

const weekPlan = ref([]);

const generateNewWeek = () => {
  weekPlan.value = generateWeeklyMenu();
};

const refreshDay = (dayIndex) => {
  weekPlan.value[dayIndex] = {
    day: weekPlan.value[dayIndex].day,
    breakfast: getRandomItem(breakfasts, weekPlan.value[dayIndex].breakfast.id),
    lunch: getRandomItem(lunches, weekPlan.value[dayIndex].lunch.id),
    dinner: getRandomItem(dinners, weekPlan.value[dayIndex].dinner.id)
  };
};

const mealDataMap = {
  breakfast: breakfasts,
  lunch: lunches,
  dinner: dinners
};

const refreshMeal = (dayIndex, mealType) => {
  const currentMealId = weekPlan.value[dayIndex][mealType].id;
  weekPlan.value[dayIndex][mealType] = getRandomItem(mealDataMap[mealType], currentMealId);
};

onMounted(() => {
  generateNewWeek();
});
</script>
