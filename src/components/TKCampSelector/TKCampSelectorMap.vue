<template lang="html">
  <div class="tk-camp-selector-map">
    <h1>CURRENT CAMP: {{ currentCamp.state }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Camp from "./ICamp";

@Component
export default class TKCampSelectorMap extends Vue {
  @Prop()
  currentCamp!: () => Camp;
}
</script>

<style scoped>
.tk-camp-selector-map {
  background-color: lightcoral;
}
</style>
