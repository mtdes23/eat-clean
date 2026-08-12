import { ref, watch } from 'vue'

const STORAGE_KEY = 'ec-store'

const defaults = {
  calorieTarget: 1200,
  servings: 1,
  favorites: [],
  locked: {},
  theme: 'dark'
}

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch { return defaults }
}

const saved = load()

const calorieTarget = ref(saved.calorieTarget)
const servings = ref(saved.servings)
const favorites = ref(saved.favorites)
const locked = ref(saved.locked)
const theme = ref(saved.theme)

const persist = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    calorieTarget: calorieTarget.value,
    servings: servings.value,
    favorites: favorites.value,
    locked: locked.value,
    theme: theme.value
  }))
}

watch([calorieTarget, servings, favorites, locked, theme], persist, { deep: true })

const toggleFavorite = (id) => {
  const idx = favorites.value.indexOf(id)
  if (idx === -1) favorites.value.push(id)
  else favorites.value.splice(idx, 1)
}

const isFavorite = (id) => favorites.value.includes(id)

const toggleLock = (dayIndex, type, meal) => {
  if (!locked.value[dayIndex]) locked.value[dayIndex] = {}
  if (locked.value[dayIndex][type]?.id === meal.id) {
    delete locked.value[dayIndex][type]
  } else {
    locked.value[dayIndex][type] = meal
  }
  locked.value = { ...locked.value }
}

const isLocked = (dayIndex, type) => !!locked.value[dayIndex]?.[type]

const setTheme = (t) => { theme.value = t }

export const useStore = () => ({
  calorieTarget,
  servings,
  favorites,
  locked,
  theme,
  toggleFavorite,
  isFavorite,
  toggleLock,
  isLocked,
  setTheme
})
