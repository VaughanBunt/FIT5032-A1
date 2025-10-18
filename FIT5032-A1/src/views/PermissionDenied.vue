<template>
    <div class="d-flex justify-content-center align-items-start min-vh-100 mt-5">
    <div class="floating-box p-4 w-100" style="max-width: 500px;">
      <div class="text-center mb-4">
        <h1>Permission Denied</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()


setTimeout(() => {
  router.push('/')
}, 5000) 
</script>
