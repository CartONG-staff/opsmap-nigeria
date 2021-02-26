<template lang="html">
  <div>
    <h1>footer from {{ source }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Footer",
  props: ["source"]
});
</script>

<style scoped>
div {
  background-color: darkred;
}
h1 {
  color: #42b983;
}
</style>
