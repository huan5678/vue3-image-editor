<template>
  <div class="content-header">
    <div class="content-header-in">
            <h1>Image Editor</h1>
    </div>
  </div>
</template>

<style scoped>
.content-header {
  container-type: inline-size;
}
.content-header-in {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
@container (width <= 415px) {
  .content-header-in {
    flex-direction: column;
  }
}
h1 {
  line-height: 1;
  margin-block: 0;
  font-size: 32px;
  letter-spacing: 0.06em;
}
.buttons {
  display: flex;
  gap: 8px;
}
</style>
