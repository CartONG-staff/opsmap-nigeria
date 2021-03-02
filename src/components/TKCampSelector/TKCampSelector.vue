<template lang="html">
  <div id="flex-container">
    <div
      class="d-flex
      flex-column
      align-center
      myItem"
    >
      <div class="d-flex pa-2">
        <TKCampSelectorCombos :states="campList" @campSelected="campSelected" />
      </div>
      <div class="d-flex pa-2">
        <TKCampSelectorMap :currentCamp="currentCamp" />
      </div>
    </div>
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
    currentCamp: "",
    campList: [
      { id: "01", name: "Herault", state: "herault01" },
      { id: "02", name: "Gard", state: "gard03" },
      { id: "03", name: "Haute Garonne", state: "haute-garrone03" }
    ]
  }),
  methods: {
    campSelected(camp: string) {
      this.currentCamp = camp;
    }
  }
});
</script>

<style scoped>
.myItem {
  background-color: green;
}
</style>
