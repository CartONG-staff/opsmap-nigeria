<template lang="html">
  <div class="tk-camp-selector">
    <TKCampSelectorComboboxes />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TKCampSelectorComboboxes from "./TKCampSelectorComboboxes";

@Component({
  components: {
    TKCampSelectorComboboxes
  }
})
export default class TKCampSelector extends Vue {}
</script>

<style scoped>
.tk-camp-selector {
  background-color: aquamarine;
}
</style>
