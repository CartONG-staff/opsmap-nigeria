<template lang="html">
  <div class="tk-camp-selector">
    <TKSurveyCombobox />
    <TKStateCombobox />
    <TKLgaCombobox />
    <TKCampCombobox />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import {
  TKCampCombobox,
  TKLgaCombobox,
  TKStateCombobox,
  TKSurveyCombobox,
} from "./TKCampSelectorComboboxes";

@Component({
  components: {
    TKCampCombobox,
    TKLgaCombobox,
    TKStateCombobox,
    TKSurveyCombobox,
  },
})
export default class TKCampSelector extends Vue {}
</script>

<style scoped>
.tk-camp-selector {
  background-color: #7b68ee88;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  border-radius: 8px;
  height: 50px;
}

.tk-camp-selector > * {
  margin: 0 15px;
}
</style>
