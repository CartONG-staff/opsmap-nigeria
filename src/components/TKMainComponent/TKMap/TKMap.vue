/* eslint-disable @typescript-eslint/no-non-null-assertion */
<template lang="html">
  <div id="tk-map">
    <TKMapZoom
      class="tk-map-zoom"
      v-on:zoomin="zoomIn"
      v-on:zoomout="zoomOut"
      v-on:zoomreset="zoomReset"
    />

    <!-- <TKMapBasemapPicker class="tk-basemap-picker" v-on:change="updateBasemap" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import mapboxgl, {
  CircleLayer,
  FillLayer,
  GeoJSONSource,
  LngLatBounds,
  LngLatLike,
  SymbolLayer,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import TKMapZoom from "./TKMapZoom.vue";
import TKMapBasemapPicker from "./TKMapBasemapPicker.vue";
import { mask } from "@/secondary/map/mask";
import { TKCampDescription } from "@/domain/core/TKCampDescription";
import { TKMapCamps } from "@/domain/map/TKMapCamps";
import { TKMapLayers, TKMapLayersStyle } from "@/domain/map/TKMapLayers";
import { Point } from "geojson";

@Component({
  components: {
    TKMapBasemapPicker,
    // TKMapFilters,
    TKMapZoom,
  },
})
export default class TKMap extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
  @Prop({ default: () => [] })
  readonly campList!: TKCampDescription[];
  @Prop()
  readonly currentCamp!: TKCampDescription | null;

  mapCamps: TKMapCamps | null = null;
  newSelectedCamp: TKCampDescription | null = null;
  mapMarkersList = [
    "planned_site",
    "planned_site_selected",
    "spontaneous_site",
    "spontaneous_site_selected",
  ];
  markersLoadedCount = 0;

  mounted(): void {
    if (this.campList !== null) {
      this.mapCamps = new TKMapCamps(this.campList, this.currentCamp);
    }

    this.initMap();
  }

  @Watch("markersLoadedCount")
  mapMarkersLoaded() {
    if (
      this.markersLoadedCount === this.mapMarkersList.length &&
      this.campList.length > 0
    ) {
      this.addCampsSources();
    }
  }

  @Watch("campList")
  changeOnCampList() {
    this.mapCamps = new TKMapCamps(this.campList, this.currentCamp);
    if (this.markersLoadedCount === this.mapMarkersList.length) {
      this.addCampsSources();
    }
  }

  @Watch("currentCamp")
  currentCampChanged() {
    this.mapCamps = new TKMapCamps(this.campList, this.currentCamp);
    const otherCampsSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapLayers.NOTSELECTEDCAMPSSOURCE
    ) as mapboxgl.GeoJSONSource;
    otherCampsSource.setData(this.mapCamps.filteredCamps.otherCamps);
    const selectedCampSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapLayers.SELECTEDCAMPSOURCE
    ) as mapboxgl.GeoJSONSource;
    selectedCampSource.setData(this.mapCamps.filteredCamps.selectedCamp);
  }

  @Watch("newSelectedCamp")
  newCampSelected() {
    this.newSelectedCamp !== null
      ? this.campSelectionChanged(this.newSelectedCamp)
      : this.campSelectionCleared();
  }

  @Emit("camp-selection-changed")
  campSelectionChanged(camp: TKCampDescription) {
    console.log("campSelected: " + camp!.id);
  }
  @Emit("camp-selection-cleared")
  campSelectionCleared(): void {
    console.log("Camp Selectio cleared");
  }
  map!: mapboxgl.Map;
  bound!: mapboxgl.LngLatBounds;

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // map object management method
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  initMap(): void {
    if (!this.bound) {
      // Init the map - world level
      this.bound = new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(-74.17, -33.34),
        new mapboxgl.LngLat(-33.57, 5.02)
      );
    }
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: "tk-map",
        style: this.appConfig.mapConfig.style,
        accessToken: this.appConfig.mapConfig.token,
        bounds: this.bound,
      });

      this.map.on("load", () => {
        this.mapMarkersList.map((img) => {
          this.map.loadImage(TKIconUrl(img), (error, image) => {
            this.markersLoadedCount++;
            this.map.addImage(img, image as ImageBitmap);
            if (error) throw error;
          });
        });
        this.map.addSource(TKMapLayers.COUNTRYMASKSOURCE, {
          type: "geojson",
          data: mask,
        });
        this.map.addLayer(
          TKMapLayersStyle[TKMapLayers.COUNTRYMASKLAYER] as FillLayer
        );
        if (
          this.markersLoadedCount === this.mapMarkersList.length &&
          this.campList.length > 0
        ) {
          this.addCampsSources();
        }
      });
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // layers management
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  addCampsSources() {
    this.map.addSource(TKMapLayers.NOTSELECTEDCAMPSSOURCE, {
      type: "geojson",
      data: this.mapCamps!.filteredCamps.otherCamps,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50,
    });

    this.map.addSource(TKMapLayers.SELECTEDCAMPSOURCE, {
      type: "geojson",
      data: this.mapCamps!.filteredCamps.selectedCamp,
    });
    this.addCampsLayer();
  }
  addCampsLayer() {
    // ADD CLUSTERS
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.CLUSTERSCIRCLELAYER] as CircleLayer
    );
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.CLUSTERSCOUNTLAYER] as SymbolLayer
    );
    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.NOTSELECTEDCAMPSLAYER] as SymbolLayer
    );

    this.map.addLayer(
      TKMapLayersStyle[TKMapLayers.SELECTEDCAMPLAYER] as SymbolLayer
    );

    // // CLUSTERS BEHAVIOR
    this.map.on("click", TKMapLayers.CLUSTERSCOUNTLAYER, (e) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [TKMapLayers.CLUSTERSCOUNTLAYER],
      });
      const clusterId = features[0].properties!.cluster_id;

      const otherCampsSource: mapboxgl.GeoJSONSource = this.map.getSource(
        TKMapLayers.NOTSELECTEDCAMPSSOURCE
      ) as mapboxgl.GeoJSONSource;
      otherCampsSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        this.map.easeTo({
          center: (features[0].geometry as Point).coordinates as LngLatLike,
          zoom: zoom,
        });
      });
    });

    // CAMPS BEHAVIOR
    this.map.on("click", TKMapLayers.NOTSELECTEDCAMPSLAYER, (e) => {
      if (e !== undefined && e.features && e.features?.length > 0) {
        this.newSelectedCamp = this.mapCamps!.toTKCampDescription(
          e.features[0].properties!.id as string
        );
      }
    });
    this.map.on("mouseenter", TKMapLayers.NOTSELECTEDCAMPSLAYER, (e) => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseleave", TKMapLayers.NOTSELECTEDCAMPSLAYER, () => {
      this.map.getCanvas().style.cursor = "";
    });
  }
  // updateBasemap() {
  //   // this.map.setStyle(this.appConfig.mapConfig.style);
  //   this.addLayers();
  // }

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
        unit: "metric",
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

  // setupCountryBoundaries() {
  //   // Init the boundaries
  //   TKRetrieveAdmin0Boundaries(this.appConfig.iso3)
  //     .then((boundaries) => {
  //       if (boundaries) {
  //         // Setup outside of boundaries mask
  //         const bbox = turf.bbox(boundaries);
  //         this.bound = new mapboxgl.LngLatBounds(
  //           new mapboxgl.LngLat(bbox[0], bbox[1]),
  //           new mapboxgl.LngLat(bbox[2], bbox[3])
  //         );
  //         const poly = turf.multiPolygon(
  //           boundaries.features[0].geometry.coordinates
  //         );
  //         console.log(poly);

  //         const bboxPoly = turf.bboxPolygon([-180, -90, 180, 90]);
  //         const polygon = turf.difference(bboxPoly, poly);
  //         if (polygon) {
  //           this.boundariesMask = polygon;
  //           this.addLayers();
  //         }
  //       }
  //     })
  //     .then(() => {
  //       this.initZoom();
  //     });
  // }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // Component lifecycle methods
  // ////////////////////////////////////////////////////////////////////////////////////////////////
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
