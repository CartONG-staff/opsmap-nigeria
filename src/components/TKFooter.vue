<template lang="html">
  <v-footer padless :absolute="true">
    <div class="tk-footer flex">
      TKFooter
    </div>
  </v-footer>
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
