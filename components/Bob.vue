<script setup>
import TalkBubble from './TalkBubble.vue';

const props = defineProps({
  left: Boolean,
  right: Boolean,
  normal: Boolean,
  talk: Boolean,
  mad: Boolean,
  sad: Boolean,
  msg: String
})
</script>

<template>
  <img
    :class="'fixed -bottom-8 ' + (props.left ? 'left-0' : 'right-0')"
    :src="`/bob-${
      props.talk ? 'talk' : props.mad ? 'mad' : props.sad ? 'sad' : 'normal'
    }.svg`"
  />
  <TalkBubble v-if="msg" :left="props.left" :right="props.right">
    {{ msg }}
  </TalkBubble>
</template>
