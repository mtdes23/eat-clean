<template>
  <div v-if="show" class="fixed bottom-24 right-4 z-50">
    <div class="glass-strong rounded-2xl p-4 w-48 shadow-2xl">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <Timer class="w-4 h-4 text-amber-400" />
          <span class="text-xs font-semibold">{{ label }}</span>
        </div>
        <button @click="$emit('close')" class="text-zinc-500 hover:text-white">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="text-center mb-3">
        <span class="text-3xl font-bold tabular-nums" :class="isRunning && remaining <= 10 ? 'text-amber-400' : 'text-white'">
          {{ formatTime(remaining) }}
        </span>
      </div>

      <div class="flex gap-2">
        <button @click="toggle" class="btn flex-1 py-2 rounded-xl text-xs font-medium text-white active:scale-95">
          {{ isRunning ? 'Tạm dừng' : 'Bắt đầu' }}
        </button>
        <button @click="reset" class="btn px-3 py-2 rounded-xl text-xs text-zinc-400 active:scale-95">
          <RotateCcw class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { Timer, X, RotateCcw } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  duration: { type: Number, default: 0 },
  label: { type: String, default: 'Bộ đếm giờ' }
})
const emit = defineEmits(['close', 'finish'])

const remaining = ref(props.duration)
const isRunning = ref(false)
let interval = null

watch(() => props.duration, (v) => { remaining.value = v; isRunning.value = false; clearInterval(interval) })
watch(() => props.show, (v) => { if (!v) { isRunning.value = false; clearInterval(interval) } })

const toggle = () => {
  if (isRunning.value) {
    clearInterval(interval)
    isRunning.value = false
  } else {
    isRunning.value = true
    interval = setInterval(() => {
      if (remaining.value > 0) {
        remaining.value--
      } else {
        clearInterval(interval)
        isRunning.value = false
        emit('finish')
      }
    }, 1000)
  }
}

const reset = () => {
  clearInterval(interval)
  isRunning.value = false
  remaining.value = props.duration
}

const formatTime = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

onUnmounted(() => clearInterval(interval))
</script>
