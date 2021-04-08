<template lang="html">
  <div id="tk-map">
    <TKMapZoom
      class="tk-map-zoom"
      v-on:zoomin="zoomIn"
      v-on:zoomout="zoomOut"
      v-on:zoomreset="zoomReset"
    />

    <TKMapFilters class="tk-map-filters" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { TKMapboxConfiguration } from "@/domain/Map/TKMapboxConfiguration";
import { TKRetrieveAdmin0Boundaries } from "@/domain/Data/Boundaries/TKBoundaries";
import TKMapFilters from "./TKMapFilters.vue";
import TKMapZoom from "./TKMapZoom.vue";

@Component({
  components: {
    TKMapFilters,
    TKMapZoom,
  },
})
export default class TKMap extends Vue {
  @Prop()
  readonly config!: TKMapboxConfiguration;

  map!: mapboxgl.Map;

  scaleOption = {
    maxWidth: 100,
    unit: "metric",
  };

  zoomIn(): void {
    if (this.map) {
      this.map.zoomIn();
    }
  }

  zoomOut(): void {
    if (this.map) {
      this.map.zoomOut();
    }
  }

  zoomReset(): void {
    if (this.map) {
      this.map.flyTo({
        center: this.config.center,
        zoom: this.config.zoom,
        speed: 2,
      });
    }
  }

  mounted(): void {
    this.map = new mapboxgl.Map({
      container: "tk-map",
      style: this.config.style,
      center: this.config.center,
      zoom: this.config.zoom,
      accessToken: this.config.token,
    });

    const scale = new mapboxgl.ScaleControl(this.scaleOption);
    this.map.addControl(scale);

    // disable map rotation using right click + drag
    this.map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    this.map.touchZoomRotate.disableRotation();

    // Retrieve borders
    TKRetrieveAdmin0Boundaries("BRA").then((boundaries) => {
      this.map.addSource("nationalBoundaries", {
        type: "geojson",
        data: boundaries,
      });
      this.map.addLayer({
        id: "nationalBoundaries",
        type: "fill",
        source: "nationalBoundaries",
        layout: {},
        paint: {
          "fill-color": "#585858",
          "fill-opacity": 0.7,
        },
      });

      const bounds = this.map.getBounds();
      this.map.fitBounds(bounds);
    });
  }
}
</script>
<style scoped>
#tk-map {
  position: relative;
  border-radius: 15px;
}

.tk-map-zoom {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2500;
  background-color: #fff;
}

.tk-map-filters {
  position: absolute;
  bottom: 26px;
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
