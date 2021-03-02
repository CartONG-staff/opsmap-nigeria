<template lang="html">
  <div class="tk-camp-selector-map">
    <h1>CURRENT CAMP: {{ currentCamp }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TKCampSelectorMap",
  props: {
    currentCamp: String
  }
});
</script>

<style scoped>
.tk-camp-selector-map {
  background-color: lightcoral;
}
</style>
