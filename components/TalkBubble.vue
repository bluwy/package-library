<script setup>
const props = defineProps({ left: Boolean, right: Boolean })
</script>

<template>
  <img
    :class="`fixed -translate-y-1/2 w-80 h-60 ` + (props.left ? 'left-30 top-25' : 'right-20 top-50')"
    src="/chat-bubble.svg"
    :style="props.left ? 'transform: scaleX(-1)' : ''"
  />
  <p
    :class="'fixed -translate-y-1/2 text-black text-2xl w-50 h-50 flex items-center justify-center text-center ' + (props.left ? 'left-45 top-48' : 'top-45 right-35')"
  >
    <slot />
  </p>
</template>
