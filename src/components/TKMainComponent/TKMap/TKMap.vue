<template lang="html">
  <div class="tk-map"></div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKMap extends Vue {}
</script>

<style lang="css" scoped>
.tk-map {
  background-color: purple;
  width: 200px;
  height: 200px;
  border-radius: 15px;
}
</style>
