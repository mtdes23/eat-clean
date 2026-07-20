<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.tab === null ? 'slide' : 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.28s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-enter-from { opacity: 0; transform: translateX(40px); }
.slide-leave-to { opacity: 0; transform: translateX(-20px); }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
