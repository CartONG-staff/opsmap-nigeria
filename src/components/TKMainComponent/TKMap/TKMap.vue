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
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";

import { TKRetrieveAdmin0Boundaries } from "@/domain/Data/Boundaries/TKBoundaries";
import TKMapFilters from "./TKMapFilters.vue";
import TKMapZoom from "./TKMapZoom.vue";

@Component({
  components: {
    TKMapFilters,
    TKMapZoom
  }
})
export default class TKMap extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;

  map!: mapboxgl.Map;

  bound!: mapboxgl.LngLatBounds;

  scaleOption = {
    maxWidth: 100,
    unit: "metric"
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
      if (this.bound) {
        this.map.fitBounds(this.bound, { padding: 100 });
      }
    }
  }

  mounted(): void {
    // Retrieve borders // this.appConfig.iso3
    TKRetrieveAdmin0Boundaries("SOM").then(boundaries => {
      if (boundaries) {
        // update bounding view
        const bbox = turf.bbox(boundaries);
        const padding = 0;
        this.bound = new mapboxgl.LngLatBounds(
          new mapboxgl.LngLat(bbox[0] + padding, bbox[3] - padding),
          new mapboxgl.LngLat(bbox[2] - padding, bbox[1] + padding)
        );

        this.map = new mapboxgl.Map({
          container: "tk-map",
          style: this.appConfig.mapConfig.style,
          accessToken: this.appConfig.mapConfig.token,
          bounds: this.bound
        });

        const scale = new mapboxgl.ScaleControl(this.scaleOption);
        this.map.addControl(scale);

        // disable map rotation using right click + drag
        this.map.dragRotate.disable();

        // disable map rotation using touch rotation gesture
        this.map.touchZoomRotate.disableRotation();

        const map = this.map;
        const zoomReset = this.zoomReset;

        this.map.on("load", function() {
          map.addSource("nationalBoundaries", {
            type: "geojson",
            data: boundaries
          });
          map.addLayer({
            id: "nationalBoundaries",
            type: "fill",
            source: "nationalBoundaries",
            layout: {},
            paint: {
              "fill-color": "#585858",
              "fill-opacity": 0.7
            }
          });
          zoomReset();
        });
      }
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
