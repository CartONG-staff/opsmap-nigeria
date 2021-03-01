<template lang="html">
  <div class="foo">
    <v-combobox
      clearable
      hide-selected
      persistent-hint
      placeholder="Select a state"
      prefix="State:"
    >
    </v-combobox>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TKComponentTest",
  props: ["source"]
});
</script>

<style scoped></style>
