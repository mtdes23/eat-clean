<template>
  <AppLayout title="Danh sách mua sắm">
    <div class="space-y-4">
      <div class="glass rounded-2xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <ShoppingCart class="w-4 h-4 text-emerald-400" />
            <span class="text-sm font-semibold">Nguyên liệu cần mua</span>
          </div>
          <span class="text-xs text-zinc-500">{{ totalCount }} món</span>
        </div>
        <div class="h-1 bg-white/8 rounded-full overflow-hidden mb-3">
          <div class="h-full bg-emerald-400 rounded-full transition-all" :style="{ width: checkedPercent + '%' }"></div>
        </div>
        <p class="text-[11px] text-zinc-500">{{ checkedCount }}/{{ totalCount }} đã hoàn thành</p>
      </div>

      <div v-if="groupedIngredients.length === 0" class="glass rounded-2xl p-8 text-center">
        <ShoppingCart class="w-10 h-10 text-zinc-600 mx-auto mb-3" />
        <p class="text-zinc-500 text-sm">Chưa có nguyên liệu nào</p>
        <p class="text-zinc-600 text-xs mt-1">Hãy tạo thực đơn tuần trước</p>
      </div>

      <div v-for="group in groupedIngredients" :key="group.category" class="glass rounded-2xl p-4">
        <h3 class="text-xs font-bold uppercase tracking-wider mb-3" :style="{ color: group.color }">{{ group.category }}</h3>
        <div class="space-y-1">
          <div v-for="(item, i) in group.items" :key="item.key"
            @click="toggleCheck(item.key)"
            class="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99]">
            <div class="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200"
              :class="isChecked(item.key) ? 'border-emerald-400 bg-emerald-400/20' : 'border-zinc-600'">
              <Check v-if="isChecked(item.key)" class="w-3 h-3 text-emerald-400" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm transition-all duration-200" :class="isChecked(item.key) ? 'text-zinc-500 line-through' : 'text-white/90'">
                {{ item.text }}
              </span>
            </div>
            <span v-if="item.count > 1" class="text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">x{{ item.count }}</span>
          </div>
        </div>
      </div>

      <div v-if="groupedIngredients.length > 0" class="flex gap-2">
        <button @click="copyList" class="btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-1 active:scale-95">
          <Copy class="w-4 h-4" /> Sao chép
        </button>
        <button @click="uncheckAll" class="btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex-1 active:scale-95">
          <RotateCcw class="w-4 h-4" /> Bỏ chọn hết
        </button>
      </div>
    </div>

    <TransitionGroup name="toast" tag="div" class="fixed left-3 right-3 top-4 z-50 max-w-sm mx-auto pointer-events-none">
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
import { useRoute } from 'vue-router'
import { breakfasts, lunches, dinners } from '../data/meals'
import { recipes } from '../data/recipes'
import AppLayout from '../components/AppLayout.vue'
import { ShoppingCart, Check, Copy, RotateCcw, CheckCircle } from 'lucide-vue-next'

const route = useRoute()
const checked = ref([])
const toasts = ref([])

const STORAGE_KEY = 'ec-shopping-checked'

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) checked.value = JSON.parse(saved)
  } catch {}
})

watch(checked, (v) => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true })

const week = computed(() => {
  try {
    const saved = localStorage.getItem('ec-week')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
})

const rawIngredients = computed(() => {
  const ingredients = []
  const seen = new Map()

  week.value.forEach(day => {
    ['breakfast', 'lunch', 'dinner'].forEach(type => {
      const meal = day[type]
      const recipe = recipes[meal.id]
      if (!recipe) return

      recipe.ingredients.forEach(ing => {
        const normalized = ing.trim().toLowerCase()
        if (seen.has(normalized)) {
          seen.get(normalized).count++
        } else {
          const item = { key: normalized, text: ing, count: 1, category: categorize(ing) }
          seen.set(normalized, item)
          ingredients.push(item)
        }
      })
    })
  })

  return ingredients
})

const categorize = (ing) => {
  const lower = ing.toLowerCase()
  if (/thịt|gà|bò|heo|cá|tôm| trứng/.test(lower)) return { category: 'Protein', color: '#f43f5e' }
  if (/rau|cải|bina|xà lách|măng|súp lơ|giá|hẹ|nấm|rong biển|bắp cải/.test(lower)) return { category: 'Rau củ', color: '#10b981' }
  if (/gạo|bún|mì|nui|yến mạch|ngũ cốc|granola|bánh mì|bánh tráng|khoai/.test(lower)) return { category: 'Tinh bột', color: '#f59e0b' }
  if (/sữa|phô mai|đậu|hũ/.test(lower)) return { category: 'Đạm thực vật', color: '#8b5cf6' }
  if (/dầu|nước mắm|xì dầu|giấm|muối|tiêu|chanh|tỏi|ớt|hành|oregano|pesto|mật ong|nước cốt/.test(lower)) return { category: 'Gia vị', color: '#0ea5e9' }
  if (/táo|chuối|dâu|việt quất|xoài|cà chua|dưa leo|bắp ngô|bí đỏ|cà rốt|ớt chuông/.test(lower)) return { category: 'Trái cây', color: '#ec4899' }
  return { category: 'Khác', color: '#71717a' }
}

const groupedIngredients = computed(() => {
  const groups = new Map()
  rawIngredients.value.forEach(item => {
    if (!groups.has(item.category.category)) {
      groups.set(item.category.category, { category: item.category.category, color: item.category.color, items: [] })
    }
    groups.get(item.category.category).items.push(item)
  })
  return Array.from(groups.values())
})

const totalCount = computed(() => rawIngredients.value.length)
const checkedCount = computed(() => rawIngredients.value.filter(i => checked.value.includes(i.key)).length)
const checkedPercent = computed(() => totalCount.value > 0 ? (checkedCount.value / totalCount.value) * 100 : 0)

const isChecked = (key) => checked.value.includes(key)
const toggleCheck = (key) => {
  const idx = checked.value.indexOf(key)
  if (idx === -1) checked.value.push(key)
  else checked.value.splice(idx, 1)
}
const uncheckAll = () => { checked.value = [] }

const toast = (msg) => {
  const id = Date.now()
  toasts.value.push({ id, msg })
  setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 2500)
}

const copyList = () => {
  const lines = groupedIngredients.value.map(g => {
    const items = g.items.map(i => `- ${i.text}${i.count > 1 ? ' (x' + i.count + ')' : ''}`).join('\n')
    return `${g.category}:\n${items}`
  }).join('\n\n')
  navigator.clipboard.writeText(lines).then(() => toast('Đã sao chép danh sách'))
}
</script>

<style scoped>
.toast-enter-active { animation: sin 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
.toast-leave-active { animation: sin 0.2s ease reverse; }
@keyframes sin { from { opacity: 0; transform: translateY(-12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
</style>
