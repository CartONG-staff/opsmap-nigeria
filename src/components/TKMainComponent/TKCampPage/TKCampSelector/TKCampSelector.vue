<template lang="html">
  <div class="tk-camp-selector">
    <TKCampSelectorComboboxes />
    <TKCampSelectorMap />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TKCampSelectorComboboxes from "./TKCampSelectorComboboxes";
import TKCampSelectorMap from "./TKCampSelectorMap.vue";

@Component({
  components: {
    TKCampSelectorComboboxes,
    TKCampSelectorMap,
  },
})
export default class TKCampSelector extends Vue {}
</script>

<style scoped>
.tk-camp-selector {
  background-color: aquamarine;
}
</style>
