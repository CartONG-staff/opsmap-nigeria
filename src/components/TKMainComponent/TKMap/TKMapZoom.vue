<template lang="html">
  <div class="tk-map-zoom">
    <div class="tk-icon-container">
      <v-btn icon small color="primary" @click="$emit('zoomin')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="tk-hseparator" />
    <div class="tk-icon-container">
      <v-btn icon small color="primary" @click="$emit('zoomout')">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </div>
    <div class="tk-hseparator" />
    <div class="tk-icon-container">
      <v-btn icon small color="primary" @click="$emit('zoomreset')">
        <v-icon>mdi-stretch-to-page-outline</v-icon>
      </v-btn>
    </div>
    <div class="tk-hseparator" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKMapZoom extends Vue {}
</script>
<style scoped>
.tk-map-zoom {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #00000011;
  display: flex;
  flex-flow: column nowrap;
  background-color: #dddddd;
}

.tk-icon-container {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tk-hseparator {
  background-color: #00000011;
  height: 1px;
  width: 100%;
}
</style>
