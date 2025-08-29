<script setup>
import Navbar from './components/Navbar.vue'

const imageUrl = '/sports-connect-bg.jpg'
</script>

<template>
  <Navbar />
  <div :style="{ backgroundImage: `url(${imageUrl})` }" class="bg-cover"></div>
</template>

<style scoped>
.bg-cover {
  background-size: cover;
  min-height: 100vh;
  width: 100%;
  filter: blur(4px);
}
</style>
