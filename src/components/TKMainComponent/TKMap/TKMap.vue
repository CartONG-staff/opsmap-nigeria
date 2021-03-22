<template lang="html">
  <div id="tk-map"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
import { TKMapboxConfiguration } from "@/domain/TKMapboxConfiguration";
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

<style lang="css" scoped>
#tk-map {
  background-color: purple;
  width: 200px;
  height: 200px;
  border-radius: 15px;
}
</style>
