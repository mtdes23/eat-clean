<template>
  <div class="min-h-screen relative" :class="{ 'min-h-screen-fill': isSafari }">
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl"></div>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isSafari = ref(false);

onMounted(() => {
  isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.min-h-screen-fill {
  min-height: -webkit-fill-available;
}
</style>
