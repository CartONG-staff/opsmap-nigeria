/* eslint-disable @typescript-eslint/no-non-null-assertion */
<template lang="html">
  <div id="tk-map">
    <TKMapZoom
      class="tk-map-zoom"
      v-on:zoomin="zoomIn"
      v-on:zoomout="zoomOut"
      v-on:zoomreset="zoomReset"
    />

    <TKMapFilters class="tk-map-filters" :dataset="dataset" />
    <!-- <TKMapBasemapPicker class="tk-basemap-picker" v-on:change="updateBasemap" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import mapboxgl, {
  CircleLayer,
  FillLayer,
  LngLatLike,
  SymbolLayer
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import TKMapZoom from "./TKMapZoom.vue";
import TKMapBasemapPicker from "./TKMapBasemapPicker.vue";
import TKMapFilters from "./TKMapFilters.vue";
import { mask } from "@/secondary/map/mask";
import { TKMapCamps } from "@/domain/map/TKMapCamps";
import { TKMapBoundaries } from "@/domain/map/TKMapBoundaries";
import { TKMapLayers, TKMapLayersStyle } from "@/domain/map/TKMapLayers";
import { FeatureCollection, Point } from "geojson";
import { TKDatasetFilterer } from "@/domain/core/TKFilters";
import { TKGeoDataset } from "@/domain/core/TKGeoDataset";

@Component({
  components: {
    TKMapBasemapPicker,
    TKMapFilters,
    TKMapZoom
  }
})
export default class TKMap extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
  @Prop({ default: () => [] })
  dataset!: TKDatasetFilterer;
  @Prop()
  geoDataset!: TKGeoDataset;

  map!: mapboxgl.Map;
  bound!: mapboxgl.LngLatBounds;
  mapCamps: TKMapCamps | null = null;
  mapBoundaries: TKMapBoundaries | null = null;
  mapMarkersList = [
    "planned_site",
    "planned_site_selected",
    "spontaneous_site",
    "spontaneous_site_selected"
  ];
  markersLoadedCount = 0;

  // Initialisation of component
  @Watch("dataset", { immediate: true })
  datasetLoaded() {
    if (this.dataset) {
      this.mapCamps = new TKMapCamps(
        this.dataset.filteredCampsList,
        this.dataset.currentCamp
      );
    }
  }
  @Watch("geoDataset", { immediate: true })
  geoDatasetLoaded() {
    if (this.geoDataset) {
      this.mapBoundaries = new TKMapBoundaries(this.geoDataset);
      this.loadMapBoundaries();
      this.currentCampChanged();
    }
  }
  // Change on injected dataset
  @Watch("dataset", { deep: true })
  currentCampChanged() {
    if (this.mapBoundaries) {
      this.mapBoundaries.changeStyle(this.dataset, this.map);
    }
    this.mapCamps = new TKMapCamps(
      this.dataset.filteredCampsList,
      this.dataset.currentCamp
    );
    const otherCampsSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapLayers.NOTSELECTEDCAMPSSOURCE
    ) as mapboxgl.GeoJSONSource;
    otherCampsSource?.setData(this.mapCamps.filteredCamps.otherCamps);
    const selectedCampSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapLayers.SELECTEDCAMPSOURCE
    ) as mapboxgl.GeoJSONSource;
    selectedCampSource?.setData(this.mapCamps.filteredCamps.selectedCamp);
  }

  mounted(): void {
    this.initMap();
  }

  @Watch("markersLoadedCount")
  mapMarkersLoaded() {
    if (
      this.markersLoadedCount === this.mapMarkersList.length &&
      this.mapCamps
    ) {
      this.addCampsSources();
    }
  }

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
        bounds: this.bound
      });

      this.map.on("load", () => {
        this.mapMarkersList.map(img => {
          this.map.loadImage(TKIconUrl(img), (error, image) => {
            this.markersLoadedCount++;
            this.map.addImage(img, image as ImageBitmap);
            if (error) throw error;
          });
        });

        // Add Geographical boundaries sources and layers
        this.map.addSource(TKMapLayers.COUNTRYMASKSOURCE, {
          type: "geojson",
          data: mask
        });
        this.map.addLayer(
          TKMapLayersStyle[TKMapLayers.COUNTRYMASKLAYER] as FillLayer
        );
        this.loadMapBoundaries();

        if (
          this.markersLoadedCount === this.mapMarkersList.length &&
          this.mapCamps
        ) {
          this.addCampsSources();
        }
      });
    }
  }

  loadMapBoundaries() {
    if (this.mapBoundaries) {
      this.map.addSource(TKMapLayers.ADMIN1SOURCE, {
        type: "geojson",
        data: this.mapBoundaries?.admin1 as FeatureCollection
      });
      this.map.addLayer(TKMapLayersStyle[TKMapLayers.ADMIN1LAYER] as FillLayer);
      this.map.addSource(TKMapLayers.ADMIN2SOURCE, {
        type: "geojson",
        data: this.mapBoundaries?.admin2 as FeatureCollection
      });
      this.map.addLayer(TKMapLayersStyle[TKMapLayers.ADMIN2LAYER] as FillLayer);
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // layers management
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  addCampsSources() {
    if (this.mapCamps) {
      this.map.addSource(TKMapLayers.NOTSELECTEDCAMPSSOURCE, {
        type: "geojson",
        data: this.mapCamps.filteredCamps.otherCamps,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50
      });

      this.map.addSource(TKMapLayers.SELECTEDCAMPSOURCE, {
        type: "geojson",
        data: this.mapCamps.filteredCamps.selectedCamp
      });
    }
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
    this.map.on("click", TKMapLayers.CLUSTERSCOUNTLAYER, e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [TKMapLayers.CLUSTERSCOUNTLAYER]
      });
      const clusterId = features[0].properties!.cluster_id;

      const otherCampsSource: mapboxgl.GeoJSONSource = this.map.getSource(
        TKMapLayers.NOTSELECTEDCAMPSSOURCE
      ) as mapboxgl.GeoJSONSource;
      otherCampsSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        this.map.easeTo({
          center: (features[0].geometry as Point).coordinates as LngLatLike,
          zoom: zoom
        });
      });
    });

    // CAMPS BEHAVIOR
    this.map.on("click", TKMapLayers.NOTSELECTEDCAMPSLAYER, e => {
      if (e !== undefined && e.features && e.features?.length > 0) {
        this.dataset.currentCamp = this.mapCamps!.toTKCampDescription(
          e.features[0].properties!.id as string
        );
      }
    });
    this.map.on("mouseenter", TKMapLayers.NOTSELECTEDCAMPSLAYER, e => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseleave", TKMapLayers.NOTSELECTEDCAMPSLAYER, () => {
      this.map.getCanvas().style.cursor = "";
    });
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
          speed: this.appConfig.mapConfig.zoomspeed
        });
      }
    }
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

.tk-basemap-picker {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2500;
}

.tk-map-filters {
  position: absolute;
  bottom: 28px;
  right: 8px;
  z-index: 2500;
}
</style>

<style>
#tk-map canvas {
  outline: 0 !important;
}
</style>
