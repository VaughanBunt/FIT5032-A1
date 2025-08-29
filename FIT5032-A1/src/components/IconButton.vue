<template>
  <div class="container-fluid">
    <button :class="buttonStyle" :disabled="disabled">
      <i :class="['bi', `bi-${icon}`]"></i>
      {{ label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
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

const onClick = defineEmits(['click'])

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

function handleClick(event) {
  if (!props.disabled) {
    onClick('click', event)
  }
}
</script>
