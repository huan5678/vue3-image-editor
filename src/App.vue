<script setup lang="ts">
import { reactive, watch } from "vue";
import {
  ContentHeader,
  ControlButtons,
  DownloadImageButton,
  PreviewImage,
  SelectFileButton,
  ImageFilter,
} from "./components/functional/";
import { drawCanvasImage } from "./utils";
type ImagesProps = {
  list: string[];
  selected: String | null;
};
const img = new Image();
const images = reactive<ImagesProps>({
  list: [],
  selected: null,
});
const previewImageParams = reactive({
  ratioH: 1,
  ratioW: 1,
  rotate: 0,
  scale: 1,
  src: "",
  translateX: 0,
  translateY: 0,
});
const previewImageSize = 640;
const SIZE = 1024;

let diffXPreview = 0;
let diffYPreview = 0;
let touchStartX = 0;
let touchStartY = 0;
let isDraggingForPreview = false;

const filterFunctions = reactive({
  brightness: 1,
  contrast: 1,
});

const reset = () => {
  previewImageParams.ratioH = 1;
  previewImageParams.ratioW = 1;
  previewImageParams.rotate = 0;
  previewImageParams.scale = 1;
  previewImageParams.src = "";
  previewImageParams.translateX = 0;
  previewImageParams.translateY = 0;
  images.list = [];
  images.selected = null;
  filterFunctions.brightness = 1;
  filterFunctions.contrast = 1;
};

const changeFile = (e: any) => {
  const files = e.target.files;
  if (!files.length) return;

  // 清空現有的列表
  reset();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      // 將每個檔案的 DataURL 添加到 images.list 中
      if (typeof reader.result !== "string") return;
      images.list.push(reader.result);
      if (files.length === 1) {
        handleSetImageCrop(reader.result);
      }
    };
  }
};

const handleSetImageCrop = (target: string) => {
  // 設定 previewImageParams 的 src
  filterFunctions.brightness = 1;
  filterFunctions.contrast = 1;
  previewImageParams.src = target;
  images.selected = target;
  // 使用 Image 物件來獲取圖片的寬度和高度
  img.src = target;
  img.onload = () => {
    const w = img.width ;
    const h = img.height;

    previewImageParams.ratioH = Math.max(1, h / w);
    previewImageParams.ratioW = Math.max(1, w / h);
    previewImageParams.rotate = 0;
    previewImageParams.scale = 1;
    previewImageParams.translateX = 0;
    previewImageParams.translateY = 0;
    diffXPreview = 0;
    diffYPreview = 0;
  };
};

const saveCurrentImageState = () => {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    drawCanvasImage({
      isDrawingImage: true,
      ctx: ctx,
      SIZE: SIZE,
      img: img,
      previewImageParams: previewImageParams,
      previewImageSize: previewImageSize,
      filterFunctions: filterFunctions,
    });

    // 從canvas中獲取DataURL
    const newDataUrl = canvas.toDataURL();

    // 更新images.list的對應項目
    const index = images.list.findIndex((image) => image === images.selected);
    if (index !== -1) {
      images.list[index] = newDataUrl;
    }
  }
};

const handleWheel = (e: WheelEvent) => {
  if (e.deltaY < 0) {
    scaleUp();
  } else {
    scaleDown();
  }
};

watch(filterFunctions, () => {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  drawCanvasImage({
    isDrawingImage: true,
    img: img,
    ctx: ctx, // 確保你有這個 ctx 變數
    SIZE: previewImageSize,
    previewImageParams: previewImageParams,
    previewImageSize: previewImageSize,
    filterFunctions: filterFunctions,
  });
});

const updateFilterFunctions = (newFilterFunctions: {
  brightness: number;
  contrast: number;
}) => {
  filterFunctions.brightness = newFilterFunctions.brightness;
  filterFunctions.contrast = newFilterFunctions.contrast;
};

const translate = (x: number, y: number) => {
  previewImageParams.translateX = x + diffXPreview;
  previewImageParams.translateY = y + diffYPreview;
};
const scaleUp = () => {
  previewImageParams.scale += 0.1;
};
const scaleDown = () => {
  previewImageParams.scale -= 0.1;
};
const rotateLeft = () => {
  previewImageParams.rotate -= 10;
};
const rotateRight = () => {
  previewImageParams.rotate += 10;
};
const mouseDownForPreview = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  touchStartX = clientX;
  touchStartY = clientY;
  isDraggingForPreview = true;
};
const mouseMoveForPreview = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const diffX = clientX - touchStartX;
  const diffY = clientY - touchStartY;

  if (isDraggingForPreview === true) {
    translate(diffX, diffY);
  }
};
const mouseUpForPreview = () => {
  const { translateX, translateY } = previewImageParams;

  isDraggingForPreview = false;
  diffXPreview = translateX;
  diffYPreview = translateY;
};
const touchStartForPreview = (e: TouchEvent) => {
  const touch = e.touches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  isDraggingForPreview = true;
};
const touchMoveForPreview = (e: TouchEvent) => {
  const touch = e.touches[0];
  const diffX = touch.clientX - touchStartX;
  const diffY = touch.clientY - touchStartY;

  if (isDraggingForPreview === true) {
    translate(diffX, diffY);
  }
};
const touchEndForPreview = () => {
  const { translateX, translateY } = previewImageParams;

  diffXPreview = translateX;
  diffYPreview = translateY;
  isDraggingForPreview = false;
};

document.body.addEventListener("mousemove", mouseMoveForPreview);
document.body.addEventListener("mouseup", mouseUpForPreview);
document.body.addEventListener("touchmove", touchMoveForPreview);
document.body.addEventListener("touchend", touchEndForPreview);
</script>

<template>
  <div class="container pt-8 lg:grid lg:min-h-screen lg:place-items-center" ref="root">
    <div class="max-h-64 max-w-[calc(192px*4+1rem*3)] overflow-auto flex items-center space-x-4">
  <div class="flex-none transition rounded shadow cursor-pointer aspect-square ring-1 ring-gray-200 hover:shadow-md" v-for="image in images.list">
    <img class="object-cover w-full h-full rounded max-h-48" :src="image" v-if="image" @click="handleSetImageCrop(image)" />
  </div>
</div>

    <div class="w-full flex flex-col gap-4 lg:w-[48rem] lg:grid lg:grid-cols-[20rem_auto] lg:grid-rows-[auto_1fr_auto] items-end plb-20">
      <ContentHeader />
      <div class="lg:col-start-1 lg:row-start-1 lg:row-end-4">
        <PreviewImage :previewImageParams="previewImageParams" :previewImageSize="previewImageSize" :filterFunctions="filterFunctions" @mousedown.prevent="mouseDownForPreview" @touchstart.prevent="touchStartForPreview" @save-image-state="saveCurrentImageState" @wheel.prevent="handleWheel" />
      </div>
      <div class="flex flex-col items-center gap-4">
        <SelectFileButton @change-file="changeFile" />
        <ImageFilter :disabled="previewImageParams.src === ''" :filterFunctions="filterFunctions" @update:filterFunctions="updateFilterFunctions" />
        <ControlButtons :disabled="previewImageParams.src === ''" @scale-up="scaleUp" @scale-down="scaleDown" @rotate-right="rotateRight" @rotate-left="rotateLeft" />
      </div>
      <div class="flex justify-center lg:col-start-2 lg:row-start-3">
        <DownloadImageButton :disabled="previewImageParams.src === ''" :img="img" :previewImageParams="previewImageParams" :previewImageSize="previewImageSize" :filterFunctions="filterFunctions" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
