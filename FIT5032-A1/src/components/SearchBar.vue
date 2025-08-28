<template>
    <label v-if="labeled" for="search" class="search-label">{{ props.label }}</label>
    <input type="text" class="search-input" id="search" :placeholder="props.placeholder">
</template>

<script setup>
    import { computed } from 'vue'
    const props = defineProps({
        label: {
            type:String
        },
        placeholder: {
            type:String,
            default: "Search"
        }
    })

    const labeled = computed(() => props.label && props.label.length > 0)
</script>