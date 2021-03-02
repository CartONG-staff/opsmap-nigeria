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
    campList: ["Herault", "Gard", "Haute Garonne"]
  })
});
</script>

<style scoped></style>
