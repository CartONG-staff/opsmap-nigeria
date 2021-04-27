<template>
  <div class="tk-placeholder-left">
    <div class="tk-map-placeholder  tk-placeholder-left-title" />
    <div class="tk-map-placeholder  tk-placeholder-left-combos" />
    <div class="tk-map-placeholder  tk-placeholder-left-combos" />
    <div class="tk-map-placeholder  tk-placeholder-left-combos" />
    <div class="tk-map-placeholder  tk-placeholder-left-combos" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class TKPlaceHolderLeft extends Vue {}
</script>

<style scoped>
.tk-placeholder-left {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: middle;
  row-gap: 5px;
  height: 100%;
}

.tk-placeholder-left-title {
  min-height: 40px;
  width: 100%;
}

.tk-placeholder-left-combos {
  min-height: 45px;
  width: 100%;
}

.tk-map-placeholder {
  animation-duration: 4s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: #e8eaed;
  background: linear-gradient(to right, #f6f7f8 8%, #ffffff 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  position: relative;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: -800px 0;
  }
  50% {
    background-position: 800px 0;
  }
  100% {
    background-position: -800px 0;
  }
}
</style>
