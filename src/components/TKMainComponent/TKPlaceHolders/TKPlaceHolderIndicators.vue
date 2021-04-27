<template>
  <div class="tk-placeholder-indicators">
    <div />
    <div />
    <div />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class TKPlaceHolderIndicators extends Vue {}
</script>

<style scoped>
.tk-placeholder-indicators {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
}

.tk-placeholder-indicators > * {
  box-shadow: 0 0 20px 2px rgba(18, 63, 98, 0.15);
  border-color: transparent;
  border-radius: 5px;
  min-height: 100px;
  overflow: hidden;
  width: 30%;
  border-radius: 15px;
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
