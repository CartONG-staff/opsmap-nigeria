<template lang="html">
  <div id="tk-map"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FydG9uZyIsImEiOiJjazJldzVobGkwOWRxM2hzNTB1M3o2cG94In0.w7FyG31FWqXm3vXSh6WtxQ";

@Component
export default class TKMap extends Vue {
  map!: mapboxgl.Map;

  mounted() {
    this.map = new mapboxgl.Map({
      container: "tk-map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-68.48130213973545, -54.8458772648677],
      zoom: 12,
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
