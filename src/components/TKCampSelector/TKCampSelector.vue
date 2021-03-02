<template lang="html">
  <div>
    <TKCampSelectorCombos v-bind:states="campList" />
    <TKCampSelectorMap />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TKCampSelectorCombos from "./TKCampSelectorCombos.vue";
import TKCampSelectorMap from "./TKCampSelectorMap.vue";

export default Vue.extend({
  name: "TKCampSelector",
  components: {
    TKCampSelectorCombos,
    TKCampSelectorMap
  },
  data: () => ({
    selectedCamp: "",
    campList: [
      { id: "01", name: "Herault", state: "herault01" },
      { id: "02", name: "Gard", state: "gard03" },
      { id: "03", name: "Haute Garonne", state: "haute-garrone03" }
    ]
  })
});
</script>

<style scoped></style>
