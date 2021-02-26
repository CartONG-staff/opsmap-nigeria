<template lang="html">
  <div class="foo">
    <h1>TKFooter from {{ source }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TKFooter",
  props: ["source"]
});
</script>

<style scoped>
.foo {
  background-color: darkred;
}
.foo h1 {
  color: #42b983;
}
</style>
