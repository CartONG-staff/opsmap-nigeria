<template>
  <div class="tk-homepage-title">
    <p>
      CCCM Site Tracker
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKHomePageTitle extends Vue {}
</script>

<style scoped>
.tk-homepage-title {
  background-color: rgb(240, 128, 128, 0.3);
}
</style>
