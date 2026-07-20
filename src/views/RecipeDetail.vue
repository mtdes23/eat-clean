<template>
  <div class="w-full min-h-screen max-w-4xl mx-auto py-6 md:py-10 px-3 sm:px-6 lg:px-8 relative">
    <button @click="$router.push('/')" class="glass-button flex items-center gap-2 px-4 md:px-4 min-h-[44px] rounded-xl text-zinc-400 hover:text-white active:text-white mb-6 md:mb-8 transition-all cursor-pointer active:scale-95">
      <ArrowLeft class="w-[18px] h-[18px]" />
      <span class="text-sm">Quay lại</span>
    </button>

    <div v-if="!meal" class="glass-card rounded-3xl p-8 md:p-12 text-center">
      <p class="text-zinc-400 text-base md:text-lg">Món này không tồn tại 🤔</p>
    </div>

    <Transition v-else name="detail" mode="out-in">
      <div class="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8 relative overflow-hidden" key="detail">
        <div class="absolute top-0 right-0 w-48 h-48 opacity-[0.04] rounded-full blur-3xl pointer-events-none" :style="{ background: mealTypeColor }"></div>

        <div class="relative z-20">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span v-if="mealTypeBadge" class="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border min-h-[28px]" :class="mealTypeBadge.class">
              {{ mealTypeBadge.label }}
            </span>
            <span class="px-3 py-1.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 min-h-[28px]" :style="{ borderColor: mealTypeColor + '40', color: mealTypeColor, background: mealTypeColor + '15' }">
              <Flame class="w-3 h-3" /> {{ meal.calories }} kcal
            </span>
          </div>

          <h1 class="text-xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-tight">
            {{ meal.name }}
          </h1>

          <p class="text-[11px] md:text-xs text-zinc-500 mb-6 md:mb-8 flex items-center gap-1">
            <Clock class="w-[14px] h-[14px]" /> Khoảng 15-20 phút &middot;
            <Award class="w-[14px] h-[14px] ml-1" /> Dễ
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <div>
              <h3 class="text-sm md:text-base font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                <ShoppingBasket class="w-4 h-4" :style="{ color: mealTypeColor }" /> Nguyên Liệu <span class="text-zinc-500 font-normal text-[11px] md:text-xs">(1 khẩu phần)</span>
              </h3>
              <ul class="space-y-2">
                <li v-for="(item, idx) in recipe?.ingredients || defaultRecipe.ingredients" :key="'ing-'+idx"
                  role="button"
                  :tabindex="0"
                  @keydown.enter="toggleIngredient(idx)"
                  @click="toggleIngredient(idx)"
                  :class="['flex gap-3 text-zinc-300 p-3.5 md:p-3 rounded-xl border border-white/5 transition-all duration-300 cursor-pointer active:scale-[0.98]', checkedIngredients.has(idx) ? 'bg-white/5' : 'bg-white/[0.02]']">
                  <div :class="['w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300', checkedIngredients.has(idx) ? 'text-white' : 'border-white/20']"
                    :style="checkedIngredients.has(idx) ? { background: mealTypeColor, borderColor: mealTypeColor } : {}">
                    <Check v-if="checkedIngredients.has(idx)" class="w-3 h-3" />
                  </div>
                  <span :class="['leading-relaxed text-sm transition-all duration-300', checkedIngredients.has(idx) ? 'line-through text-zinc-600' : '']">{{ item }}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-sm md:text-base font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                <ChefHat class="w-4 h-4" :style="{ color: mealTypeColor }" /> Cách Làm
              </h3>
              <div class="space-y-4 md:space-y-5">
                <div v-for="(step, idx) in recipe?.steps || defaultRecipe.steps" :key="'step-'+idx" class="flex gap-3 md:gap-4">
                  <div class="flex flex-col items-center">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[11px] shrink-0 border transition-all duration-300"
                      :style="currentStep >= idx ? { background: mealTypeColor, borderColor: mealTypeColor } : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)' }">
                      {{ idx + 1 }}
                    </div>
                    <div v-if="idx < (recipe?.steps || defaultRecipe.steps).length - 1"
                      class="w-px flex-1 my-1.5 transition-all duration-500"
                      :style="{ background: currentStep > idx ? mealTypeColor + '60' : 'rgba(255,255,255,0.08)' }"></div>
                  </div>
                  <div class="pt-0.5 pb-2" @click="currentStep = idx">
                    <p class="text-zinc-300 text-sm leading-relaxed">{{ step }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { breakfasts, lunches, dinners } from '../data/meals';
import { recipes } from '../data/recipes';
import { ArrowLeft, Flame, ShoppingBasket, ChefHat, Check, Clock, Award } from 'lucide-vue-next';

const props = defineProps({ id: { type: String, required: true } });

const allMeals = [...breakfasts, ...lunches, ...dinners];
const checkedIngredients = ref(new Set());
const currentStep = ref(-1);

const meal = computed(() => allMeals.find(m => m.id === props.id));
const recipe = computed(() => recipes[props.id] || null);

const mealTypeColor = computed(() => {
  const id = props.id;
  if (id?.startsWith('b')) return '#f59e0b';
  if (id?.startsWith('l')) return '#10b981';
  if (id?.startsWith('d')) return '#8b5cf6';
  return '#ffffff';
});

const mealTypeBadge = computed(() => {
  const id = props.id;
  if (id?.startsWith('b')) return { label: 'Bữa Sáng', class: 'text-amber-400 border-amber-400/30 bg-amber-400/10' };
  if (id?.startsWith('l')) return { label: 'Bữa Trưa', class: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' };
  if (id?.startsWith('d')) return { label: 'Bữa Tối', class: 'text-violet-400 border-violet-400/30 bg-violet-400/10' };
  return null;
});

const toggleIngredient = (idx) => {
  const next = new Set(checkedIngredients.value);
  if (next.has(idx)) next.delete(idx);
  else next.add(idx);
  checkedIngredients.value = next;
};

const defaultRecipe = {
  ingredients: [
    '50g thành phần chính protein (gà/cá/bò)',
    '100g rau củ sạch (salad/bông cải)',
    '1/2 chén tinh bột chậm (gạo lứt/khoai lang)',
    'Gia vị cơ bản: dầu oliu, muối chanh, xốt Eat Clean'
  ],
  steps: [
    'Sơ chế sạch các loại nguyên liệu và rau củ.',
    'Chế biến thành phần protein (áp chảo, luộc hoặc nướng) với một ít dầu oliu và gia vị nhạt.',
    'Rau củ luộc hoặc trộn salad kèm với nước xốt healthy (dầu dấm/mè rang).',
    'Trang trí ra đĩa thật đẹp mắt và thưởng thức!'
  ]
};
</script>

<style scoped>
.detail-enter-active { animation: fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.detail-leave-active { animation: fadeUp 0.2s ease reverse; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
