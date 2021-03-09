<template lang="html">
  <div class="tk-camp-selector-comboboxes">
    <TKStateCombobox />
    <TKLgaCombobox />
    <TKCampCombobox />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TKCampCombobox from "./TKCampCombobox.vue";
import TKLgaCombobox from "./TKLgaCombobox.vue";
import TKStateCombobox from "./TKStateCombobox.vue";

@Component({
  components: {
    TKCampCombobox,
    TKLgaCombobox,
    TKStateCombobox
  }
})
export default class TKCampSelectorComboboxes extends Vue {}
</script>

<style scoped>
.tk-camp-selector-comboboxes {
  background-color: mediumslateblue;
  display: flex;
  flex-direction: row;
}
</style>
