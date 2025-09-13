<template>
  <div class="star-rating d-flex">
    <span
      v-for="n in 5"
      :key="n"
      class="star"
      :class="{ filled: n <= currentRating }"
      @click="$emit('update:rating', n)"
    >
      ★
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  rating: { type: Number, default: 0 }
})

const currentRating = computed(() => props.rating)
</script>
