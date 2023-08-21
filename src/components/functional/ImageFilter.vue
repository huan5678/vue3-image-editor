<template>
  <div class="flex flex-col w-full gap-2 p-0">
    <div class="flex items-center justify-center">
      <label for="brightness" class="block mb-2 font-medium text-md me-auto">亮度</label>
      <span class="me-auto">({{ internalFilterFunctions.brightness }})</span>
    </div>
    <div class="relative w-full mx-auto">
      <input id="brightness" type="range" class="bg-gray-200 rounded-full" step="0.05" min="0.8" max="2" :value="internalFilterFunctions.brightness" 
       @input="updateBrightness" :disabled="props.disabled">
    </div>
  </div>
  <div class="flex flex-col w-full gap-2 p-0">
    <div class="flex items-center justify-center">
      <label for="contrast" class="block mb-2 font-medium text-md me-auto">對比度</label>
      <span class="me-auto">({{ internalFilterFunctions.contrast }})</span>
    </div>
    <div class="relative w-full mx-auto">
      <input id="contrast" type="range" class="bg-gray-200 rounded-full" step="0.05" min="0.5" max="2" :value="internalFilterFunctions.contrast" 
       @input="updateContrast" :disabled="props.disabled">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  filterFunctions: {
    type: Object,
    required: true,
    default: {
      brightness: 1,
      contrast: 1,
    },
  },
});

const internalFilterFunctions = reactive({
  brightness: props.filterFunctions.brightness,
  contrast: props.filterFunctions.contrast
});

const emits = defineEmits([ 'update:filterFunctions' ]);

const updateBrightness = (event: Event) => {
    internalFilterFunctions.brightness = parseFloat((event.target as HTMLInputElement).value);
    emits('update:filterFunctions', internalFilterFunctions);
};

const updateContrast = (event: Event) => {
    internalFilterFunctions.contrast = parseFloat((event.target as HTMLInputElement).value);
    emits('update:filterFunctions', internalFilterFunctions);
};

watch(
  () => props.filterFunctions,
  (newVal) =>
  {
    emits('update:filterFunctions', newVal);
    internalFilterFunctions.brightness = newVal.brightness;
    internalFilterFunctions.contrast = newVal.contrast;
  },
  { deep: true }  // 因為我們監聽的是一個物件，所以需要設置 deep: true
);
</script>

<style scoped>

    [type=range] { -webkit-appearance: none; width: 100%; }
    [type=range]:focus { outline: none; }


    [type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        cursor: pointer;
        border-radius: 1rem;
    }
    [type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: 4px solid rgb(175, 175, 175);
        border-radius: 50%;
        background-color: white;
        cursor: pointer;
        height: 1.25rem; width: 1.25rem;
        transform: translateY(calc(-50% + 5px));
    }
</style>