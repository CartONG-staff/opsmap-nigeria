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
          @campSelected="campSelected"
          @selectionCleared="selectionCleared"
          @selectionInvalid="selectionInvalid"
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
    TKCampSelectorMap
  }
})
export default class TKCampSelector extends Vue {
  currentCamp: Camp = new Camp();

  campList: Camp[] = [
    { id: "01", name: "Herault", state: "herault01" },
    { id: "02", name: "Gard", state: "gard03" },
    { id: "03", name: "Haute Garonne", state: "haute-garrone03" }
  ];

  campSelected(camp: Camp) {
    console.log(camp);
    this.currentCamp = camp;
  }
  selectionCleared() {
    console.log("Selection cleared");
  }
  selectionInvalid() {
    console.log("Selection invalided");
  }
}
</script>

<style scoped>
.myItem {
  background-color: green;
}
</style>
