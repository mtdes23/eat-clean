<template>
  <AppLayout title="Tất cả Món ăn">
    <div class="space-y-4">
      <div class="glass rounded-2xl p-3">
        <div class="flex items-center gap-2 mb-3">
          <Search class="w-4 h-4 text-zinc-400" />
          <input v-model="search" type="text" placeholder="Tìm món ăn..."
            class="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none" />
          <button v-if="search" @click="search = ''" class="text-zinc-500 hover:text-white">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <button v-for="f in filters" :key="f.key" @click="activeFilter = f.key"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="activeFilter === f.key ? 'bg-white/15 text-white' : 'text-zinc-500 hover:text-white'">
            {{ f.label }}
          </button>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[10px] text-zinc-500 w-16">{{ calRange[0] }}-{{ calRange[1] }} kcal</span>
          <input v-model.number="calRange[0]" type="range" min="100" max="600" step="50" class="flex-1 accent-amber-400" />
          <input v-model.number="calRange[1]" type="range" min="100" max="600" step="50" class="flex-1 accent-amber-400" />
        </div>
      </div>

      <div v-if="filteredMeals.length === 0" class="glass rounded-2xl p-8 text-center">
        <Search class="w-10 h-10 text-zinc-600 mx-auto mb-3" />
        <p class="text-zinc-500 text-sm">Không tìm thấy món ăn</p>
      </div>

      <div v-for="cat in filteredCategories" :key="cat.key">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2 h-2 rounded-full" :class="cat.dot"></span>
          <h2 class="text-sm font-bold uppercase tracking-wide" :style="{ color: cat.color }">{{ cat.label }}</h2>
          <span class="text-[10px] text-zinc-600">({{ cat.meals.length }})</span>
        </div>
        <div class="space-y-2">
          <div v-for="m in cat.meals" :key="m.id" @click="$router.push('/recipe/' + m.id)"
            role="button" :tabindex="0"
            @keydown.enter="$router.push('/recipe/' + m.id)"
            class="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 active:scale-[0.98]"
            :class="cat.card">
            <div class="w-1.5 h-12 rounded-full" :style="{ background: cat.color }"></div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-0.5">
                <p class="text-sm font-semibold text-white/90 truncate">{{ m.name }}</p>
                <Heart v-if="isFavorite(m.id)" class="w-3 h-3 text-amber-400 shrink-0" fill="currentColor" />
              </div>
              <p class="text-[11px] mt-0.5 flex items-center gap-3">
                <span :style="{ color: cat.color }">
                  <Flame class="w-3 h-3 inline -mt-0.5" /> {{ m.calories }} kcal
                </span>
              </p>
            </div>
            <ChevronRight class="w-4 h-4 text-zinc-600 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { breakfasts, lunches, dinners } from '../data/meals'
import { useStore } from '../composables/useStore'
import AppLayout from '../components/AppLayout.vue'
import { Flame, ChevronRight, Search, X, Heart } from 'lucide-vue-next'

const { isFavorite } = useStore()

const search = ref('')
const activeFilter = ref('all')
const calRange = ref([100, 600])

const filters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'breakfast', label: 'Sáng' },
  { key: 'lunch', label: 'Trưa' },
  { key: 'dinner', label: 'Tối' }
]

const allMeals = computed(() => [
  ...breakfasts.map(m => ({ ...m, type: 'breakfast' })),
  ...lunches.map(m => ({ ...m, type: 'lunch' })),
  ...dinners.map(m => ({ ...m, type: 'dinner' }))
])

const filteredMeals = computed(() => {
  let result = allMeals.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(q))
  }

  if (activeFilter.value !== 'all') {
    result = result.filter(m => m.type === activeFilter.value)
  }

  result = result.filter(m => m.calories >= calRange.value[0] && m.calories <= calRange.value[1])

  return result
})

const filteredCategories = computed(() => {
  const categories = [
    { key: 'breakfast', label: 'Bữa Sáng', color: '#f59e0b', dot: 'bg-amber-400', card: 'meal-amber' },
    { key: 'lunch', label: 'Bữa Trưa', color: '#10b981', dot: 'bg-emerald-400', card: 'meal-emerald' },
    { key: 'dinner', label: 'Bữa Tối', color: '#8b5cf6', dot: 'bg-violet-400', card: 'meal-violet' }
  ]

  return categories.map(cat => ({
    ...cat,
    meals: filteredMeals.value.filter(m => m.type === cat.key)
  })).filter(cat => cat.meals.length > 0)
})
</script>
