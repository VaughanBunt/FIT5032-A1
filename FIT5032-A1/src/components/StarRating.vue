<template>
  <div class="star-rating d-flex">
    <span
      v-for="n in 5"
      :key="n"
      class="star"
      :class="{ filled: n <= currentRating }"
      @click="editable ? $emit('update:rating', n) : null"
    >
      ★
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  rating: { type: Number, default: 0 },
  editable: { type: Boolean, default: true }
})

const currentRating = computed(() => props.rating)
</script>
