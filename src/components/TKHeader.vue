<template lang="html">
  <v-app-bar-title>
    <div class="tk-header">
      TKHeader
    </div>
  </v-app-bar-title>
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
