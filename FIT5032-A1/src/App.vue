<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
const navbarHeight = ref(0)

onMounted(() => {
  const navbar = document.querySelector('nav.navbar')
  if (navbar) navbarHeight.value = navbar.offsetHeight
})
</script>

<template>
  <Navbar class="fixed-top" />
  <div class="position-relative" :style="{ paddingTop: navbarHeight + 'px' }">
    <div class="[position-absolute top-${} start-0 w-100 h-100 bg-cover"></div>

    <div class="position-relative z-index-1">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.bg-cover {
  background-image: url('./images/sports-connect-bg.jpg');
  background-size: cover;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  filter: blur(4px);
}
</style>
