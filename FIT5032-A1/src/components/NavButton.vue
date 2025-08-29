<template>
  <router-link :to="targetRoute" :class="buttonStyle">
    <i :class="['bi', `bi-${icon}`]"></i>
    {{ label }}
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  to: {
    type: String,
  },
  icon: {
    type: String,
  },
  label: {
    type: String,
  },
  colour: {
    type: String,
    default: 'secondary',
  },
  size: {
    type: String,
    default: 'medium',
    validator(value) {
      return ['small', 'medium', 'large'].includes(value)
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  style: {
    type: String,
    default: 'filled',
    validator(value) {
      return ['outlined', 'filled'].includes(value)
    },
  },
})

const route = useRoute()

const targetRoute = computed(() => props.to || route.fullPath)

const formattedSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'btn-sm'
    case 'large':
      return 'btn-lg'
    default:
      return ''
  }
})

const formattedStyle = computed(() => {
  return props.style == 'outlined' ? `btn-outline-${props.colour}` : `btn-${props.colour}`
})

const buttonStyle = computed(() => {
  return ['btn', formattedStyle.value, formattedSize.value]
})
</script>
