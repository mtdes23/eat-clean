<template>
  <div class="min-h-screen flex flex-col" :class="theme">
    <header class="sticky top-0 z-40 pt-safe" style="background: linear-gradient(180deg, #000 60%, transparent)">
      <div class="px-4 pb-2 flex items-center justify-between">
        <h1 class="text-lg font-bold tracking-tight">{{ title }}</h1>
        <button @click="toggleTheme" class="btn min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-zinc-400 active:text-white" aria-label="Đổi giao diện">
          <Sun v-if="theme === 'dark'" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
        </button>
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
import { useStore } from '../composables/useStore'
import { CalendarDays, UtensilsCrossed, Info, Sun, Moon } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { theme, setTheme } = useStore()

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

const toggleTheme = () => {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>

<style scoped>
.pt-safe { padding-top: env(safe-area-inset-top, 12px); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 8px); }
.dark { --bg: #000; --text: #fff; }
.light { --bg: #f5f5f5; --text: #18181b; }
.light { background: var(--bg); color: var(--text); }
.light :deep(.glass) { background: linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 100%); border-color: rgba(0,0,0,0.1); }
.light :deep(.glass-strong) { background: linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.03) 100%); border-color: rgba(0,0,0,0.1); }
.light :deep(.btn) { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); }
.light :deep(.tab-active) { background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.12); }
</style>
