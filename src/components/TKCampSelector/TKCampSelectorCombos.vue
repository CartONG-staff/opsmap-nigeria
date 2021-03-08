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
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import Camp from "./Camp";

@Component
export default class TKCampSelectorMap extends Vue {
  @Prop({ default: () => [] })
  readonly states!: Camp[];

  campSelected(event: Camp) {
    if (event != null) {
      if (event.id) {
        this.campSelectionChanged(event);
      } else {
        this.campSelectionUnknown();
      }
    } else {
      this.campSelectionCleared();
    }
  }

  @Emit("camp-selection-changed")
  campSelectionChanged(c: Camp) {
    console.log("campSelected: " + c.id + " # " + c.name + " # " + c.state);
  }

  @Emit("camp-selection-cleared")
  campSelectionCleared() {
    console.log("selectionCleared");
  }

  @Emit("camp-selection-unknown")
  campSelectionUnknown() {
    console.log("selectionUnknown");
  }
}
</script>

<style scoped>
.tk-camp-selector-combos {
  background-color: lightcyan;
}
</style>
