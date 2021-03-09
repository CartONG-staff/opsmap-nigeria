<template lang="html">
  <div class="tk-header">
    <h1>TKFooter from {{ source }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKHeader extends Vue {}
</script>

<style scoped>
.tk-header {
  background-color: dodgerblue;
}
</style>
