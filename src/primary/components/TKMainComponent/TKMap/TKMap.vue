<template lang="html">
  <div id="tk-map">
    <TKMapZoom
      class="tk-map-zoom"
      v-on:zoomin="zoomIn"
      v-on:zoomout="zoomOut"
      v-on:zoomreset="zoomReset"
    />
    <TKMapFilters class="tk-map-filters" />
    <TKMapBasemapPicker class="tk-basemap-picker" :basemaps="basemaps" />
  </div>
</template>

<script lang="ts">
/* eslint-disable@typescript-eslint/no-non-null-assertion */
import { Component, Vue, Watch } from "vue-property-decorator";
import mapboxgl, {
  CircleLayer,
  FillLayer,
  LineLayer,
  LngLatLike,
  Style,
  SymbolLayer
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IconPosition, TKIconUrl } from "@/domain/utils/TKIconUrl";
import TKMapZoom from "./TKMapZoom.vue";
import TKMapBasemapPicker from "./TKMapBasemapPicker.vue";
import TKMapFilters from "./TKMapFilters.vue";
import { TKMapSites } from "@/domain/map/TKMapSites";
import { TKMapBoundaries } from "@/domain/map/TKMapBoundaries";
import {
  computeMapLayersStyle,
  TKMapSource,
  TKMapLayerStyles,
  CLUSTERS_CIRCLE,
  CLUSTERS_COUNT,
  NOT_SELECTED_SITES,
  SELECTED_SITE,
  COUNTRY_MASK
} from "@/domain/map/TKMapLayers";
import { TKBasemapsLayer } from "@/domain/map/TKBasemaps";
import { Point } from "geojson";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import TKGeoDatasetModule from "@/store/modules/geodataset/TKGeoDatasetModule";

@Component({
  components: {
    TKMapBasemapPicker,
    TKMapFilters,
    TKMapZoom
  }
})
export default class TKMap extends Vue {
  map!: mapboxgl.Map;
  bound!: mapboxgl.LngLatBounds;
  mapSites: TKMapSites | null = null;
  mapBoundaries: TKMapBoundaries | null = null;
  mapMarkersList: Array<string> = [];
  markersLoadedCount = 0;
  basemaps = TKBasemapsLayer;

  mapLayerStyle!: TKMapLayerStyles;

  mounted() {
    this.initMap();
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  get dataset() {
    return TKDatasetModule.dataset;
  }

  // Initialisation of component
  @Watch("dataset", { immediate: true })
  datasetLoaded() {
    if (TKDatasetModule.dataset) {
      this.mapMarkersList = [];
      TKDatasetModule.dataset.surveys.map(survey => {
        Object.keys(survey.fdf.siteTypes).map(i => {
          const site = survey.fdf.siteTypes[i];
          this.mapMarkersList.push(site.iconFileName.normal);
          this.mapMarkersList.push(site.iconFileName.selected);
        });
      });

      this.mapMarkersList = [...new Set(this.mapMarkersList)];

      this.mapLayerStyle = computeMapLayersStyle(
        TKDatasetModule.dataset.currentSurvey.fdf.siteTypes
      );

      this.mapSites = new TKMapSites(
        TKDatasetModule.dataset.filteredTypedSitesList,
        TKDatasetModule.dataset.currentSite
      );
      if (this.mapBoundaries) {
        this.mapBoundaries.updateBoundariesStyle(this.map, this.bound);
      }
    }
  }

  // Change on filtered data -> why rebuild the whole TKMapSites list ?
  // TODO: improve this !!!!
  @Watch("dataset.lastModification")
  @Watch("geoDataset")
  currentSiteChanged() {
    if (this.mapBoundaries) {
      this.mapBoundaries.updateBoundariesStyle(this.map, this.bound);
    }
    this.mapSites = new TKMapSites(
      TKDatasetModule.dataset.filteredTypedSitesList,
      TKDatasetModule.dataset.currentSite
    );

    const otherSitesSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapSource.NOT_SELECTED_SITES
    ) as mapboxgl.GeoJSONSource;
    otherSitesSource?.setData(this.mapSites.filteredSites.otherSites);
    const selectedSiteSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapSource.SELECTED_SITE
    ) as mapboxgl.GeoJSONSource;

    selectedSiteSource?.setData(this.mapSites.filteredSites.selectedSite);
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  get geoDataset() {
    return TKGeoDatasetModule.geoDataset;
  }

  @Watch("geoDataset", { immediate: true })
  geoDatasetLoaded() {
    if (this.geoDataset) {
      this.mapBoundaries = new TKMapBoundaries(
        this.geoDataset,
        TKConfigurationModule.configuration.spatial.dbConfig,
        this.dataset.currentSurvey.fdf.spatial
      );
    }
  }

  // TODO: source of trouvle right here
  @Watch("basemaps", { deep: true })
  updateBasemap(): void {
    this.basemaps.basemapsList.map(x => {
      if (x.id === this.basemaps.selected) {
        this.map.setStyle(x.style as Style);
        this.map.on("style.load", () => {
          this.addImages();
        });
      }
    });
  }

  @Watch("markersLoadedCount")
  mapMarkersLoaded() {
    if (
      this.markersLoadedCount === this.mapMarkersList.length &&
      this.mapSites
    ) {
      this.addSources();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // map object management method
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  initMap(): void {
    if (!this.bound) {
      // Init the map - world level
      this.bound = new mapboxgl.LngLatBounds(
        new mapboxgl.LngLat(
          TKConfigurationModule.configuration.spatial.mapConfig.bounds[0],
          TKConfigurationModule.configuration.spatial.mapConfig.bounds[1]
        ),
        new mapboxgl.LngLat(
          TKConfigurationModule.configuration.spatial.mapConfig.bounds[2],
          TKConfigurationModule.configuration.spatial.mapConfig.bounds[3]
        )
      );
    }
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: "tk-map",
        style: this.basemaps.basemapsList[0].style,
        accessToken:
          TKConfigurationModule.configuration.spatial.mapConfig.token,
        bounds: this.bound,
        attributionControl: false
      });

      this.map.addControl(
        new mapboxgl.AttributionControl({
          customAttribution:
            '<strong>© <a href="https://cartong.org/" target="_blank"> CartONG </a></strong>'
        }),
        "bottom-right"
      );

      this.map.addControl(
        new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" })
      );

      this.map.on("load", () => {
        this.addImages();

        if (this.mapBoundaries) {
          this.mapBoundaries.updateBoundariesStyle(this.map, this.bound);
        }
      });
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // layers management
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  addImages() {
    if (!this.map.hasImage(this.mapMarkersList[0])) {
      this.markersLoadedCount = 0;
    }
    this.mapMarkersList.map(img => {
      this.map.loadImage(TKIconUrl(img, IconPosition.MAP), (error, image) => {
        if (!this.map.hasImage(img)) {
          this.markersLoadedCount++;
          this.map.addImage(img, image as ImageBitmap);
          if (error) throw error;
        }
      });
    });
    if (
      this.markersLoadedCount === this.mapMarkersList.length &&
      this.mapSites
    ) {
      this.addSources();
    }
  }
  addSources() {
    // Add Geographical boundaries sources
    if (!this.map.getSource(TKMapSource.COUNTRY_MASK)) {
      this.map.addSource(TKMapSource.COUNTRY_MASK, {
        type: "geojson",
        data: `${process.env.VUE_APP_GENERAL_CONFIG_DIRECTORY}${TKConfigurationModule.configuration.spatial.admin0LocalURL}`
      });
    }

    if (this.mapBoundaries) {
      for (const level of TKConfigurationModule.configuration.spatial
        .adminLevelsMap) {
        if (!this.map.getSource(level)) {
          this.map.addSource(level, {
            type: "geojson",
            data: this.mapBoundaries?.geodataset[level]
          });
        }
      }
    }
    // Add Sites
    if (this.mapSites) {
      if (!this.map.getSource(TKMapSource.NOT_SELECTED_SITES)) {
        this.map.addSource(TKMapSource.NOT_SELECTED_SITES, {
          type: "geojson",
          data: this.mapSites.filteredSites.otherSites,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50
        });
      }
      if (!this.map.getSource(TKMapSource.SELECTED_SITE)) {
        this.map.addSource(TKMapSource.SELECTED_SITE, {
          type: "geojson",
          data: this.mapSites.filteredSites.selectedSite
        });
      }
    }
    this.addLayers();
  }

  addLayers() {
    // ADD ADMIN BOUNDARIES
    if (!this.map.getLayer(COUNTRY_MASK)) {
      this.map.addLayer(this.mapLayerStyle[COUNTRY_MASK] as FillLayer);
    }
    for (const level of TKConfigurationModule.configuration.spatial
      .adminLevelsMap) {
      this.map.addLayer(this.mapLayerStyle[level]?.fill as FillLayer);
      this.map.addLayer(this.mapLayerStyle[level]?.border as LineLayer);
    }
    // ADD CLUSTERS
    this.map.addLayer(this.mapLayerStyle[CLUSTERS_CIRCLE] as CircleLayer);
    this.map.addLayer(this.mapLayerStyle[CLUSTERS_COUNT] as SymbolLayer);
    this.map.addLayer(this.mapLayerStyle[NOT_SELECTED_SITES] as SymbolLayer);
    this.map.addLayer(this.mapLayerStyle[SELECTED_SITE] as SymbolLayer);

    // // CLUSTERS BEHAVIOR
    this.map.on("click", CLUSTERS_COUNT, e => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: [CLUSTERS_COUNT as string]
      });
      const clusterId = features[0].properties?.cluster_id;

      const otherSitesSource: mapboxgl.GeoJSONSource = this.map.getSource(
        TKMapSource.NOT_SELECTED_SITES
      ) as mapboxgl.GeoJSONSource;
      otherSitesSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        this.map.easeTo({
          center: (features[0].geometry as Point).coordinates as LngLatLike,
          zoom: zoom
        });
      });
    });

    // SITES BEHAVIOR
    this.map.on("click", NOT_SELECTED_SITES, e => {
      if (e !== undefined && e.features && e.features?.length > 0) {
        TKDatasetModule.dataset.setCurrentSiteByName(
          e.features[0].properties?.name
        );
      }
    });
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    this.map.on("mouseenter", NOT_SELECTED_SITES, e => {
      this.map.getCanvas().style.cursor = "pointer";
      if (e.features) {
        const coordinates: [number, number] = [
          e.features[0].properties?.lng,
          e.features[0].properties?.lat
        ];
        const description = `<div>
                                <h4 class="primary--text">${e.features[0].properties?.name} </h4>
                                <h8 class="primary--text">${e.features[0].properties?.lastSubmission}</h8>
                             </div>`;
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.map);
      }
    });
    this.map.on("mouseleave", SELECTED_SITE, () => {
      this.map.getCanvas().style.cursor = "";
      popup.remove();
    });
    this.map.on("mouseenter", SELECTED_SITE, e => {
      this.map.getCanvas().style.cursor = "pointer";
      if (e.features) {
        const coordinates: [number, number] = [
          e.features[0].properties?.lng,
          e.features[0].properties?.lat
        ];
        const description = `<div>
                                <h4 class="primary--text">${e.features[0].properties?.name} </h4>
                                <h8 class="primary--text">${e.features[0].properties?.lastSubmission}</h8>
                             </div>`;
        popup
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.map);
      }
    });
    this.map.on("mouseleave", NOT_SELECTED_SITES, () => {
      this.map.getCanvas().style.cursor = "";
      popup.remove();
    });

    this.mapBoundaries?.initLayersStyle(this.map);
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
          padding:
            TKConfigurationModule.configuration.spatial.mapConfig.padding,
          speed: TKConfigurationModule.configuration.spatial.mapConfig.zoomspeed
        });
      }
    }
  }
}
</script>
<style scoped>
.tk-map-zoom {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.tk-basemap-picker {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
}

.tk-map-filters {
  position: absolute;
  bottom: 28px;
  right: 8px;
  z-index: 1;
}
</style>

<style>
#tk-map canvas {
  outline: 0 !important;
}

.mapboxgl-ctrl-scale {
  position: absolute;
  bottom: 0px;
  left: 90px;
  text-align: center;
  border: 1px solid var(--v-primary-base);
  border-top: none;
  margin-right: 100px;
}
</style>
