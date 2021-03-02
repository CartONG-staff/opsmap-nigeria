<template>
  <v-app>
    <v-main>
      <TKHeader source="generic lib - HEADER" />
      <TKComponentTest />
      <TKFooter source="generic lib - FOOTER" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

import TKComponentTest from "./components/TKComponentTest.vue";
import TKFooter from "./components/TKFooter.vue";
import TKHeader from "./components/TKHeader.vue";

export default Vue.extend({
  name: "App",
  components: {
    TKComponentTest,
    TKFooter,
    TKHeader
  },
  methods: {}
});
</script>

<style></style>
