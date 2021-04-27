<template lang="html">
  <div class="tk-map-placeholder"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class TKPlaceHolderMap extends Vue {}
</script>
<style scoped>
.tk-map-placeholder {
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
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
