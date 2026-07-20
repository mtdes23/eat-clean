<template>
  <div class="min-h-screen relative" :class="{ 'min-h-screen-fill': isSafari }">
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl"></div>
    </div>
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const transitionName = ref('page');
const isSafari = ref(false);

if (typeof navigator !== 'undefined') {
  isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

router.beforeEach((to, from) => {
  if (from.name === 'home' && to.name === 'recipe') {
    transitionName.value = 'slide-left';
  } else {
    transitionName.value = 'slide-right';
  }
});
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: absolute; width: 100%;
}
.slide-left-enter-from { opacity: 0; transform: translateX(30px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-30px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-30px); }
.slide-right-leave-to { opacity: 0; transform: translateX(30px); }

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to { opacity: 0; }

.min-h-screen-fill { min-height: -webkit-fill-available; }
</style>
