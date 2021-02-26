<template lang="html">
  <div class="foo">
    <h1>Footer from {{ source }}</h1>
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
.foo {
  background-color: darkred;
}
.foo h1 {
  color: #42b983;
}
</style>
