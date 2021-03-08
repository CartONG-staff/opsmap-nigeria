<template lang="html">
  <div class="tk-camp-selector-map">
    <h1>CURRENT CAMP: {{ currentCamp.state }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Camp from "./Camp";

@Component
export default class TKCampSelectorMap extends Vue {
  @Prop()
  readonly currentCamp!: Camp;

  @Watch("currentCamp")
  currentCampChanged() {
    console.log("[MAP watched] hop hop hop changed");
  }
}
</script>

<style scoped>
.tk-camp-selector-map {
  background-color: lightcoral;
}
</style>
