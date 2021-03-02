<template lang="html">
  <div class="foo">
    <v-combobox
      clearable
      hide-selected
      persistent-hint
      placeholder="none selected"
      prefix="State:"
      :items="states"
    >
    </v-combobox>
    <v-select
      clearable
      hide-selected
      persistent-hint
      placeholder="none selected"
      prefix="City:"
      :items="cities"
    ></v-select>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import StatesList from "./StatesList";

export default Vue.extend({
  name: "TKComponentTest",
  data: () => ({
    states: [""],
    cities: [""],
    camps: [""]
  }),
  mounted: function(): void {
    this.states = Object.keys(StatesList);
    this.cities = [""];

    Object.keys(StatesList).map(x => console.log(StatesList[x]));
  }
});
</script>

<style scoped></style>
