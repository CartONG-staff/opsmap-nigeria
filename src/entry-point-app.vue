<template>
  <v-app>
    <v-main>
      <TKHeader source="generic lib - HEADER" />
      <TKCampSelector />
      <TKFooter source="generic lib - FOOTER" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

import TKCampSelector from "./components/TKCampSelector";
import TKFooter from "./components/TKFooter.vue";
import TKHeader from "./components/TKHeader.vue";

export default Vue.extend({
  name: "App",
  components: {
    TKCampSelector,
    TKFooter,
    TKHeader
  },
  methods: {}
});
</script>

<style></style>
