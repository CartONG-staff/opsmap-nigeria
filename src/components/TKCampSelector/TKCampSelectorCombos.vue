<template lang="html">
  <div class="tk-camp-selector-combos">
    <h1>THIS IS THE COMBO BOX SPACE</h1>
    <v-combobox
      clearable
      hide-selected
      persistent-hint
      placeholder="none selected"
      prefix="State:"
      :items="states"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TKCampSelectorCombos",
  props: {
    states: [String]
  }
});
</script>

<style scoped>
.tk-camp-selector-combos {
  background-color: lightcyan;
}
</style>
