<script setup lang="ts">
import { computed } from "vue";

const classes = computed(() => {
  return [
    "button-filled",
    `button-filled--${props.buttonType}`,
    `button-filled--${props.size}`,
    props.circle ? "button-filled--circle" : "button-filled--basic",
  ];
});
const props = defineProps({
  buttonType: {
    type: String,
    required: false,
    default: "primary",
    validator: (value: string) => {
      return ["primary", "secondary"].includes(value);
    },
  },
  circle: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: String,
    required: false,
    default: "md",
    validator: (value: string) => {
      return ["sm", "md", "lg"].includes(value);
    },
  },
  tag: {
    type: String,
    required: false,
    default: "button",
  },
});

defineEmits(["click"]);
</script>

<template>
  <component :class="classes" :is="tag" @click="$emit('click', $event)">
    <slot></slot>
  </component>
</template>

<style scoped>
.button-filled {
  appearance: none;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 0;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition-duration: 0.12s;
  transition-property: background-color;
}
.button-filled--primary {
  background-color: #0891b2;
}
.button-filled--primary:hover {
  background-color: #06b6d4;
}
.button-filled--primary:active {
  background-color: #22d3ee;
}
.button-filled--secondary {
  background-color: #475569;
}
.button-filled--secondary:hover {
  background-color: #64748b;
}
.button-filled--secondary:active {
  background-color: #94a3b8;
}
.button-filled--sm {
  gap: 4px;
  height: 32px;
}
.button-filled--md {
  gap: 4px;
  height: 44px;
}
.button-filled--lg {
  gap: 8px;
  height: 56px;
  font-size: 16px;
  font-weight: 700;
}
.button-filled--basic {
  letter-spacing: 0.12em;
}
.button-filled--basic.button-filled--sm {
  padding-inline: 12px;
}
.button-filled--basic.button-filled--md {
  padding-inline: 20px;
}
.button-filled--basic.button-filled--lg {
  padding-inline: 28px;
}
.button-filled--circle.button-filled--sm {
  width: 32px;
}
.button-filled--circle.button-filled--md {
  width: 44px;
}
.button-filled--circle.button-filled--lg {
  width: 56px;
}
.button-filled[disabled] {
  cursor: not-allowed;
  color: #94a3b8;
  background-color: #cbd5e1;
}
</style>
