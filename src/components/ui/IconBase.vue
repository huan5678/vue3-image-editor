<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: false,
    default: "md",
  },
});
const size = computed(() => {
  switch (props.size) {
    case "sm":
      return "16";
    case "md":
      return "24";
    case "lg":
      return "32";
    default:
      return props.size;
  }
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
  >
    <path :d="props.path" />
  </svg>
</template>

<style scope>
svg {
  display: block;
  fill: currentColor;
}
</style>
