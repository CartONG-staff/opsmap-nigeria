<template>
  <div id="app">
    <TKHeader source="generic lib - HEADER" />
    <TKFooter source="generic lib - FOOTER" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import TKFooter from "./components/TKFooter.vue";
import TKHeader from "./components/TKHeader.vue";

export default Vue.extend({
  name: "App",
  components: {
    TKFooter,
    TKHeader
  },
  methods: {}
});
</script>

<style></style>
