<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-40 pt-safe" style="background: linear-gradient(180deg, #000 60%, transparent)">
      <div class="px-4 pb-2">
        <h1 class="text-lg font-bold tracking-tight">{{ title }}</h1>
      </div>
    </header>

    <main class="flex-1 px-4 pb-4">
      <slot />
    </main>

    <nav v-if="showNav" class="fixed bottom-0 left-0 right-0 z-40 pb-safe" style="background: linear-gradient(0deg, #000 60%, transparent)">
      <div class="flex items-center justify-around px-6 pt-2 pb-1">
        <button v-for="tab in tabs" :key="tab.key"
          @click="navigate(tab)"
          class="flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all duration-200 min-w-[72px]"
          :class="activeTab === tab.key ? 'tab-active' : 'text-zinc-500'">
          <component :is="tab.icon" class="w-5 h-5" />
          <span class="text-[10px] font-medium">{{ tab.label }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CalendarDays, UtensilsCrossed, Info } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  title: { type: String, default: '' }
})

const tabs = [
  { key: 'menu', label: 'Menu', icon: CalendarDays, route: '/' },
  { key: 'meals', label: 'Món ăn', icon: UtensilsCrossed, route: '/meals' },
  { key: 'about', label: 'Giới thiệu', icon: Info, route: '/about' }
]

const activeTab = computed(() => route.meta?.tab || null)
const showNav = computed(() => route.meta?.tab !== null)

const navigate = (tab) => {
  router.push(tab.route)
}
</script>

<style scoped>
.pt-safe { padding-top: env(safe-area-inset-top, 12px); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 8px); }
</style>
