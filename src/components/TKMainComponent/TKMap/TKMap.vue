<template lang="html">
  <div id="tk-map"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
import { TKMapboxConfiguration } from "@/domain/Map/TKMapboxConfiguration";
mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FydG9uZyIsImEiOiJjazJldzVobGkwOWRxM2hzNTB1M3o2cG94In0.w7FyG31FWqXm3vXSh6WtxQ";

@Component
export default class TKMap extends Vue {
  @Prop()
  readonly config!: TKMapboxConfiguration;

  map!: mapboxgl.Map;

  mounted() {
    this.map = new mapboxgl.Map({
      container: "tk-map",
      style: this.config.style,
      center: this.config.center,
      zoom: this.config.zoom,
    });
  }
}
</script>
<style scoped>
@import url("https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css");
#tk-map {
  background-color: purple;
  border-radius: 15px;
  width: 100%;
  height: 500px;
}
</style>
