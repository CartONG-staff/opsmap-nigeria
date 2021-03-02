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
          :states="campList"
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
import Vue, { PropType } from "vue";
import Camp from "./ICamp";
import TKCampSelectorCombos from "./TKCampSelectorCombos.vue";
import TKCampSelectorMap from "./TKCampSelectorMap.vue";

export default Vue.extend({
  name: "TKCampSelector",
  components: {
    TKCampSelectorCombos,
    TKCampSelectorMap
  },
  data: () => ({
    currentCamp: Object as PropType<Camp>,
    campList: [
      { id: "01", name: "Herault", state: "herault01" },
      { id: "02", name: "Gard", state: "gard03" },
      { id: "03", name: "Haute Garonne", state: "haute-garrone03" }
    ]
  }),
  methods: {
    campSelected(camp: PropType<Camp>) {
      console.log(camp);
      this.currentCamp = camp;
    },
    selectionCleared() {
      console.log("Selection cleared");
    },
    selectionInvalid() {
      console.log("Selection invalided");
    }
  }
});
</script>

<style scoped>
.myItem {
  background-color: green;
}
</style>
