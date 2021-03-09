<template lang="html">
  <div class="tk-infos-displayer"></div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKInfosDisplayer extends Vue {}
</script>

<style scoped>
.tk-infos-displayer {
  background-color: aquamarine;
}
</style>
