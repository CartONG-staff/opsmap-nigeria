<template lang="html">
  <div class="tk-map-zoom">
    <div class="tk-icon-container">
      <v-icon @click="$emit('zoomin')">
        mdi-plus
      </v-icon>
    </div>
    <div class="tk-hseparator" />
    <div class="tk-icon-container">
      <v-icon @click="$emit('zoomout')">
        mdi-minus
      </v-icon>
    </div>
    <div class="tk-hseparator" />
    <div class="tk-icon-container">
      <v-icon @click="$emit('zoomreset')">
        mdi-stretch-to-page-outline
      </v-icon>
    </div>
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
  height: 1px;
  width: 100%;
}
</style>
