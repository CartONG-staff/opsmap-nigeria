<template>
  <div id="app">
    <TKHeader source="generic lib - HEADER" />
    <TKComponentTest />
    <TKFooter source="generic lib - FOOTER" />
  </div>
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
