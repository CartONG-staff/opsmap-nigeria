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
      item-text="name"
      item-value="id"
      @change="campSelected"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ICamp from "./ICamp";

export default Vue.extend({
  name: "TKCampSelectorCombos",
  props: {
    states: {
      type: Object as () => ICamp
    }
  },
  methods: {
    campSelected(event: any) {
      this.$emit("campSelected", event.state);
    }
  }
});
</script>

<style scoped>
.tk-camp-selector-combos {
  background-color: lightcyan;
}
</style>
