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
        this.map.fitBounds(this.bound, {
          padding: this.appConfig.mapConfig.padding,
          speed: this.appConfig.mapConfig.zoomspeed
        });
      }
    }
  }

  mounted(): void {
    // Init the map - world level
    this.bound = new mapboxgl.LngLatBounds(
      new mapboxgl.LngLat(-90, 90),
      new mapboxgl.LngLat(90, -90)
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

    // Init the boundaries
    TKRetrieveAdmin0Boundaries(this.appConfig.iso3).then(boundaries => {
      if (boundaries) {
        // compute global bbox
        const bbox = turf.bbox(boundaries);
        const squared = turf.square(bbox);
        this.bound = new mapboxgl.LngLatBounds(
          new mapboxgl.LngLat(squared[0], squared[3]),
          new mapboxgl.LngLat(squared[2], squared[1])
        );

        // hack to access map and zoomReset inside the callback
        this.map.once("load", () => {
          this.map.addSource("nationalBoundaries", {
            type: "geojson",
            data: boundaries
          });
          this.map.addLayer({
            id: "nationalBoundaries",
            type: "fill",
            source: "nationalBoundaries",
            layout: {},
            paint: {
              "fill-color": "#585858",
              "fill-opacity": 0.7
            }
          });
          this.zoomReset();
          this.map.once("zoomend", () => {
            this.map.setMinZoom(this.map.getZoom());
            this.map.setMaxBounds(this.map.getBounds());
          });
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
