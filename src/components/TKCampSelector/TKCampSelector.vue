<template lang="html">
  <div id="flex-container">
    <div
      class="d-flex
      flex-column
      align-center
      myItem"
    >
      <div class="d-flex pa-2">
        <TKCampSelectorCombos
          :states="this.campList"
          @camp-selection-changed="campSelected"
          @camp-selection-cleared="selectionCleared"
          @camp-selection-unknown="selectionUnknown"
        />
      </div>
      <div class="d-flex pa-2">
        <TKCampSelectorMap :currentCamp="this.currentCamp" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Camp from "./Camp";
import TKCampSelectorCombos from "./TKCampSelectorCombos.vue";
import TKCampSelectorMap from "./TKCampSelectorMap.vue";

@Component({
  components: {
    TKCampSelectorCombos,
    TKCampSelectorMap,
  },
})
export default class TKCampSelector extends Vue {
  readonly NoCamp = new Camp();
  readonly CampUnknown = { id: "unknown", state: "unknown", name: "unknown" };
  currentCamp: Camp = this.NoCamp;

  campList: Camp[] = [
    { id: "01", name: "Herault", state: "herault01" },
    { id: "02", name: "Gard", state: "gard03" },
    { id: "03", name: "Haute Garonne", state: "haute-garrone03" },
  ];

  campSelected(camp: Camp) {
    console.log("Selector: " + camp.id);
    this.currentCamp = camp;
  }

  selectionCleared() {
    console.log("Selector: " + "Selection cleared");
    this.currentCamp = this.NoCamp;
  }

  selectionUnknown() {
    console.log("Selector: " + "Selection unknown");
    this.currentCamp = this.CampUnknown;
  }
}
</script>

<style scoped>
.myItem {
  background-color: green;
}
</style>
