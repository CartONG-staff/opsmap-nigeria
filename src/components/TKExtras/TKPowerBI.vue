<template lang="html">
  <div class="tk-powerbi">
    <iframe id="tk-powerbi-container"></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKPowerBI extends Vue {}
</script>

<style scoped>
.tk-powerbi {
  min-height: 400px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
}

#tk-powerbi-container {
  background-color: aquamarine;
  flex-grow: 1;
  border: none;
  margin: 0;
  padding: 0;
}
</style>
