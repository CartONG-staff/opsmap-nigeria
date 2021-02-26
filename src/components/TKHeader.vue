<template lang="html">
  <div class="hea">
    <h1>TKHeader</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TKHeader",
  props: ["source"]
});
</script>

<style scoped>
.hea {
  background-color: darkred;
}
.hea h1 {
  color: #42b983;
}
</style>
