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
import Vue, { PropType } from "vue";
import Camp from "./ICamp";

export default Vue.extend({
  name: "TKCampSelectorCombos",
  props: {
    states: {
      type: Array as PropType<Camp[]>
    }
  },
  methods: {
    campSelected(event: Camp) {
      if (event != null) {
        if (event.id != "undefined") {
          console.log("campSelected: " + event.id);
          this.$emit("campSelected", {
            id: event.id,
            name: event.name,
            state: event.state
          });
        } else {
          console.log("selectionInvalid");
          this.$emit("selectionInvalid");
        }
      } else {
        console.log("selectionCleared");
        this.$emit("selectionCleared");
      }
    }
  }
});
</script>

<style scoped>
.tk-camp-selector-combos {
  background-color: lightcyan;
}
</style>
