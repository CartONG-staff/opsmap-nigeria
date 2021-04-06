<template lang="html">
  <div class="tk-map-filters">
    <div class="tk-map-filter">
      <v-checkbox class="tk-map-filter-checkbox" hide-details></v-checkbox>
      <div classs="tk-map-filter-text">Item 1</div>
    </div>
    <div class="tk-map-filter">
      <v-checkbox class="tk-map-filter-checkbox" hide-details></v-checkbox>
      <div class="tk-map-filter-text">Item 1</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKMapFilter extends Vue {}
</script>
<style scoped>
.tk-map-filters {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #00000011;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  padding: 5px;
}

.tk-map-filter-checkbox {
  padding: 0px;
  margin: 0px;
}

.tk-map-filter {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.tk-icon-container {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tk-hseparator {
  height: 1px;
  width: 100%;
  background-color: #dddddd;
}
</style>
