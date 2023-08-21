<script setup lang="ts">
import { onMounted, ref } from "vue";
import { mdiDownloadBoxOutline } from "@mdi/js";
import { drawCanvasImage } from "../../utils/";
import { ButtonFilled, IconBase } from "../ui/";

const SIZE = 1024;
const canvas = ref<HTMLCanvasElement | null>(null);
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  img: {
    type: HTMLImageElement,
    required: true,
  },
  previewImageParams: {
    type: Object,
    required: true,
    default: {
      ratioH: 1,
      ratioW: 1,
      rotate: 0,
      scale: 1,
      src: "",
      translateX: 0,
      translateY: 0,
    },
  },
  previewImageSize: {
    type: Number,
    required: true,
    default: 500,
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
let ctx: CanvasRenderingContext2D | null = null;


const downloadImage = () => {
  const a = document.createElement("a");

  drawCanvasImage({
    ctx,
    img: props.img,
    previewImageParams: props.previewImageParams,
    previewImageSize: props.previewImageSize,
    SIZE: SIZE,
  });
  a.href = canvas.value?.toDataURL() ?? "";
  a.download = "image.png";
  a.click();
};

onMounted(async () => {
  ctx = canvas.value?.getContext("2d") ?? null;
});
</script>

<template>
  <div>
    <ButtonFilled :disabled="props.disabled" size="lg" @click="downloadImage">
      <IconBase :path="mdiDownloadBoxOutline" name="" size="lg" />
        圖片下載
    </ButtonFilled>
    <canvas :width="SIZE" :height="SIZE" ref="canvas"></canvas>
  </div>
</template>

<style scoped>
canvas {
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
