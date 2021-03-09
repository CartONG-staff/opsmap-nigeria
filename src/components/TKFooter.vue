<template lang="html">
  <div class="tk-footer">
    TKFooter
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKFooter extends Vue {}
</script>

<style scoped>
.tk-footer {
  background-color: cornflowerblue;
}
</style>
