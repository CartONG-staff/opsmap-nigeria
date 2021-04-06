<template lang="html">
  <div>
    <div id="tk-map">
      <TKMapZoom class="tk-map-zoom" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { TKMapboxConfiguration } from "@/domain/Map/TKMapboxConfiguration";

import TKMapZoom from "./TKMapZoom.vue";

@Component({
  components: {
    TKMapZoom
  }
})
export default class TKMap extends Vue {
  @Prop()
  readonly config!: TKMapboxConfiguration;

  map!: mapboxgl.Map;

  mounted(): void {
    this.map = new mapboxgl.Map({
      container: "tk-map",
      style: this.config.style,
      center: this.config.center,
      zoom: this.config.zoom,
      accessToken: this.config.token
    });
  }
}
</script>
<style scoped>
#tk-map {
  border-radius: 15px;
  width: 100%;
  height: 450px;
}

.tk-map-zoom {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2500;
  background-color: #fff;
}
</style>

<style>
#tk-map canvas {
  outline: 0 !important;
}
</style>
