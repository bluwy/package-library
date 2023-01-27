<script setup>
const props = defineProps({ left: Boolean, right: Boolean })
</script>

<template>
  <img
    :class="`fixed top-50 -translate-y-1/2 w-80 h-60 ` + (props.left ? ' left-20' : ' right-20')"
    src="/chat-bubble.svg"
    :style="props.left ? 'transform: scaleX(-1)' : ''"
  />
  <p
    class="fixed top-45 right-35 -translate-y-1/2 text-black text-2xl w-50 h-50 flex items-center justify-center"
  >
    <slot />
  </p>
</template>
