<template lang="html">
  <div class="tk-camp-selector">
    <div id="flex-container">
      <div
        class="d-flex
      flex-column
      align-center
      myItem"
      >
        <div class="d-flex pa-2">
          <TKCampSelectorComboboxes />
        </div>
        <div class="d-flex pa-2">
          <TKCampSelectorMap />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TKCampSelectorComboboxes from "./TKCampSelectorComboboxes";
import TKCampSelectorMap from "./TKCampSelectorMap.vue";

@Component({
  components: {
    TKCampSelectorComboboxes,
    TKCampSelectorMap
  }
})
export default class TKCampSelector extends Vue {}
</script>

<style scoped>
.myItem {
  background-color: green;
}
</style>
