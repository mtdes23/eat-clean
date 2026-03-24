<template>
  <div class="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <button @click="$router.push('/')" class="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-300 hover:text-white mb-8 group transition-all">
      <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      Quay lại Thực Đơn
    </button>
    
    <div class="glass-card rounded-3xl p-8 relative overflow-hidden group mb-8">
      <div class="light-sweep hidden group-hover:block"></div>
      
      <div class="relative z-20">
        <div class="flex items-center gap-2 mb-4">
          <span class="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-zinc-300 uppercase tracking-widest border border-white/10">
            Chi tiết Món ăn
          </span>
          <span class="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/20 flex items-center gap-1">
            <Flame class="w-3 h-3" /> {{ meal?.calories || 0 }} kcal
          </span>
        </div>
        
        <h1 class="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-6 tracking-tight">
          {{ meal?.name || 'Món này không tồn tại 🤔' }}
        </h1>
        
        <div v-if="meal" class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div>
            <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ShoppingBasket class="w-5 h-5 text-pink-400" /> Nguyên Liệu (1 Khẩu phần)
            </h3>
            <ul class="space-y-3">
              <li v-for="(item, idx) in recipe?.ingredients || defaultRecipe.ingredients" :key="idx" class="flex gap-3 text-zinc-300 p-3 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group/li hover:bg-white/10 transition-colors">
                <CheckCircle class="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ChefHat class="w-5 h-5 text-blue-400" /> Cách Làm
            </h3>
            <div class="space-y-4">
              <div v-for="(step, idx) in recipe?.steps || defaultRecipe.steps" :key="idx" class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div class="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {{ idx + 1 }}
                  </div>
                  <div v-if="idx !== (recipe?.steps?.length || defaultRecipe.steps.length) - 1" class="w-px h-full bg-white/10 my-2"></div>
                </div>
                <div class="pt-1 pb-4">
                  <p class="text-zinc-300 leading-relaxed">{{ step }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { breakfasts, lunches, dinners } from '../data/meals';
import { recipes } from '../data/recipes';
import { ArrowLeft, Flame, ShoppingBasket, ChefHat, CheckCircle } from 'lucide-vue-next';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const allMeals = [...breakfasts, ...lunches, ...dinners];

const meal = computed(() => {
  return allMeals.find(m => m.id === props.id);
});

const recipe = computed(() => {
  return recipes[props.id] || null;
});

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
    'Trang trí ra đĩa thật đẹp mắt, chị em nhớ chụp ảnh check-in sống ảo nhé! 📸'
  ]
};
</script>
