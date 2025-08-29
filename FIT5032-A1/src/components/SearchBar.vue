<template>
  <label v-if="labeled" for="search" class="search-label">{{ props.label }}</label>
  <input
    type="search"
    class="form-control"
    id="search"
    :placeholder="props.placeholder"
    aria-label="Search"
  />
  <button class="btn btn-secondary" type="submit">Search</button>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: {
    type: String,
  },
  placeholder: {
    type: String,
    default: 'Search',
  },
})

const labeled = computed(() => props.label && props.label.length > 0)
</script>
