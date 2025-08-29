<template>
  <div class="dropdown">
    <button
      class="btn btn-secondary nav-link dropdown-toggle"
      type="button"
      :id="props.id"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ props.label }}
    </button>
    <ul class="dropdown-menu" :aria-labelledby="id">
      <li v-for="(item, index) in props.items" :key="index">
        <a class="dropdown-item" href="#" @click.prevent="itemClicked(item)">
          <i v-if="item.icon" :class="['bi', item.icon]"></i>
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  items: {
    type: Array,
    default: () => [], // { text: string, icon?: string, action?: function }
  },
  id: {
    type: String,
    default: () => `dropdown-${Math.random().toString(36).substring(2, 11)}`,
  },
})

const emit = defineEmits(['select'])

const itemClicked = (item) => {
  if (item.action && typeof item.action === 'function') {
    item.action()
  }
  emit('select', item)
}
</script>
