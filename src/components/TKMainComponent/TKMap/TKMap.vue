<template lang="html">
  <div id="tk-map">
    <TKMapZoom
      class="tk-map-zoom"
      v-on:zoomin="zoomIn"
      v-on:zoomout="zoomOut"
      v-on:zoomreset="zoomReset"
    />

    <TKMapFilters class="tk-map-filters" />

    <TKMapBasemapPicker class="tk-basemap-picker" v-on:change="updateBasemap" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as turf from "@turf/turf";

import { TKGeneralConfiguration } from "@/domain/config/TKGeneralConfiguration";

import { TKRetrieveAdmin0Boundaries } from "@/domain/data/boundaries/TKBoundaries";
import TKMapFilters from "./TKMapFilters.vue";
import TKMapZoom from "./TKMapZoom.vue";
import TKMapBasemapPicker from "./TKMapBasemapPicker.vue";

@Component({
  components: {
    TKMapBasemapPicker,
    TKMapFilters,
    TKMapZoom,
  },
})
export default class TKMap extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;

  map!: mapboxgl.Map;

  bound!: mapboxgl.LngLatBounds;

  boundariesMask!: turf.Feature<
    turf.helpers.MultiPolygon | turf.helpers.Polygon
  >;

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // map object management method
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  initMap(): void {
    if (!this.bound) {
      // Init the map - world level
      this.bound = new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(-90, -90),
        new mapboxgl.LngLat(90, 90)
      );
    }
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: "tk-map",
        style: this.appConfig.mapConfig.style,
        accessToken: this.appConfig.mapConfig.token,
        bounds: this.bound
      });
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // layers management
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  addLayers() {
    if (this.boundariesMask) {
      this.map.addSource("outsidemask", {
        type: "geojson",
        data: this.boundariesMask
      });
      this.map.addLayer({
        id: "outsidemask",
        type: "fill",
        source: "outsidemask",
        layout: {},
        paint: {
          "fill-color": "#585858",
          "fill-opacity": 0.7
        }
      });
    }
  }

  updateBasemap() {
    // this.map.setStyle(this.appConfig.mapConfig.style);
    this.addLayers();
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // Zoom related
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  initZoom(): void {
    if (!this.map) {
      return;
    }
    this.zoomReset();
    this.map.once("zoomend", () => {
      // Avoid multiple zoom variation when on fly
      const scale = new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "metric"
      });
      this.map.addControl(scale);
    });
  }

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
          speed: this.appConfig.mapConfig.zoomspeed,
        });
      }
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // Boundaries management
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  setupCountryBoundaries() {
    // Init the boundaries
    TKRetrieveAdmin0Boundaries(this.appConfig.iso3)
      .then(boundaries => {
        if (boundaries) {
          // Setup outside of boundaries mask
          const bbox = turf.bbox(boundaries);
          this.bound = new mapboxgl.LngLatBounds(
            new mapboxgl.LngLat(bbox[0], bbox[1]),
            new mapboxgl.LngLat(bbox[2], bbox[3])
          );
          const poly = turf.multiPolygon(
            boundaries.features[0].geometry.coordinates
          );
          console.log(poly);

          const bboxPoly = turf.bboxPolygon([-180, -90, 180, 90]);
          const polygon = turf.difference(bboxPoly, poly);
          if (polygon) {
            this.boundariesMask = polygon;
            this.addLayers();
          }
        }
      })
      .then(() => {
        this.initZoom();
      });
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // Component lifecycle methods
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  mounted(): void {
    this.initMap();
    this.map.on("load", () => {
      // disable map rotation using right click + drag
      this.map.dragRotate.disable();
      // disable map rotation using touch rotation gesture
      this.map.touchZoomRotate.disableRotation();

      this.setupCountryBoundaries();
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
}

.tk-basemap-picker {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2500;
}
</style>

<style>
#tk-map canvas {
  outline: 0 !important;
}
</style>
