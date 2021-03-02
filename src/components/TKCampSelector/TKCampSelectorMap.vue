<template lang="html">
  <div class="tk-camp-selector-map">
    <h1>CURRENT CAMP: {{ currentCamp.state }}</h1>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Camp from "./ICamp";

export default Vue.extend({
  name: "TKCampSelectorMap",
  props: {
    currentCamp: Object as PropType<Camp>
  }
});
</script>

<style scoped>
.tk-camp-selector-map {
  background-color: lightcoral;
}
</style>
