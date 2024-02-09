<template lang="html">
  <div id="tk-map">
    <TKMapZoom
      class="tk-map-zoom"
      v-on:zoomin="zoomIn"
      v-on:zoomout="zoomOut"
      v-on:zoomreset="zoomReset"
    />
    <TKMapFilters v-if="showFilters" class="tk-map-filters" />
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
  computeMapLayersSiteTypesStyle,
  computeMapLayersAdminStyle,
  TKMapSource,
  TKMapLayerSiteTypesStyles,
  TKMapLayerAdminStyles,
  TKMapLayerPopulationCountStyles,
  CLUSTERS_CIRCLE,
  CLUSTERS_COUNT,
  NOT_SELECTED_SITES,
  SELECTED_SITE,
  COUNTRY_MASK,
  computeMapLayersPopulationCountStyle,
  POPULATION_COUNT_CLUSTERS_CIRCLE,
  POPULATION_COUNT_CLUSTERS_COUNT,
  SELECTED_SITE_POPULATION_COUNT,
  NOT_SELECTED_SITES_POPULATION_COUNT,
  NOT_SELECTED_SITES_POPULATION_CIRCLE,
  SELECTED_SITE_POPULATION_CIRCLE
} from "@/domain/map/TKMapLayers";
import { TKBasemapsLayer } from "@/domain/map/TKBasemaps";
import { FeatureCollection, Point } from "geojson";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import TKGeoDatasetModule from "@/store/modules/geodataset/TKGeoDatasetModule";
import { MapLegendDisplayStyle } from "@/domain/opsmapConfig/TKOpsmapConfiguration";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
import { TKSiteMapVisualisationType } from "@/domain/survey/TKSurveyMapVisualisation";
import { TKSubmissionEntryText } from "@/domain/survey/TKSubmissionEntry";

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
  showFilters =
    TKConfigurationModule.configuration.options.mapLegendDisplayStyle !==
    MapLegendDisplayStyle.HIDDEN;
  mapLayerAdminStyle!: TKMapLayerAdminStyles;
  mapLayerSiteTypesStyle!: TKMapLayerSiteTypesStyles;
  mapLayerPopulationCountStyle!: TKMapLayerPopulationCountStyles;
  mapVisualisationsLoaded = {
    [TKSiteMapVisualisationType.SITE_TYPES]: false,
    [TKSiteMapVisualisationType.POPULATION_COUNT]: false
  };

  mounted() {
    this.initMap();
  }

  // ////////////////////////////////////////////////////////////TKConfigurationModule.configuration.options.mapLegendDisplayStyle//////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  get dataset() {
    return TKDatasetModule.dataset;
  }

  get visualisationMode() {
    return TKVisualizerOptionsModule.mapVisualisation;
  }

  @Watch("visualisationMode")
  visualisationModeChange() {
    if (this.visualisationMode === TKSiteMapVisualisationType.SITE_TYPES)
      this.addSiteTypesLayers();
    if (this.visualisationMode === TKSiteMapVisualisationType.POPULATION_COUNT)
      this.addSitePopulationCountLayers();
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

      this.mapLayerAdminStyle = computeMapLayersAdminStyle();
      this.mapLayerSiteTypesStyle = computeMapLayersSiteTypesStyle(
        TKDatasetModule.dataset.currentSurvey.fdf.siteTypes
      );

      this.mapSites = new TKMapSites(
        TKDatasetModule.dataset.filteredTypedSitesList,
        TKDatasetModule.dataset.currentSite
      );
      this.addOtherVisualisationAttributesToMapSites();

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
    console.log("yep");
    if (this.mapBoundaries) {
      this.mapBoundaries.updateBoundariesStyle(this.map, this.bound);
    }
    console.log(TKDatasetModule.dataset);
    this.mapSites = new TKMapSites(
      TKDatasetModule.dataset.filteredTypedSitesList,
      TKDatasetModule.dataset.currentSite
    );
    console.log(this.mapSites);
    this.addOtherVisualisationAttributesToMapSites();

    const otherSitesSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapSource.NOT_SELECTED_SITES
    ) as mapboxgl.GeoJSONSource;
    otherSitesSource?.setData(this.mapSites.filteredSites.otherSites);

    const selectedSiteSource: mapboxgl.GeoJSONSource = this.map.getSource(
      TKMapSource.SELECTED_SITE
    ) as mapboxgl.GeoJSONSource;
    selectedSiteSource?.setData(this.mapSites.filteredSites.selectedSite);
  }

  addOtherVisualisationAttributesToMapSites() {
    if (this.dataset.currentSurvey.options.sitesMapVisualisation.length > 0) {
      this.dataset.currentSurvey.options.sitesMapVisualisation.map(x => {
        if (x.type === TKSiteMapVisualisationType.POPULATION_COUNT) {
          const populationCountField = this.dataset.currentSurvey.options.sitesMapVisualisation.filter(
            x => x.type === TKSiteMapVisualisationType.POPULATION_COUNT
          )[0].field;

          this.mapLayerPopulationCountStyle = computeMapLayersPopulationCountStyle(
            populationCountField
          );

          for (const site of this.dataset.currentSurvey.sites) {
            this.mapSites?.filteredSites.otherSites.features.map(x => {
              if (site.id === x.properties?.id) {
                x.properties[populationCountField] =
                  parseInt(
                    (site.submissions[0].entries[
                      populationCountField
                    ] as TKSubmissionEntryText)?.answerLabel[
                      this.$root.$i18n.locale
                    ]
                  ) || 0;
              }
            });
            (this.mapSites?.filteredSites
              .selectedSite as FeatureCollection).features.map(x => {
              if (site.id === x.properties?.id) {
                x.properties[populationCountField] =
                  parseInt(
                    (site.submissions[0].entries[
                      populationCountField
                    ] as TKSubmissionEntryText)?.answerLabel[
                      this.$root.$i18n.locale
                    ]
                  ) || 0;
              }
            });
          }
        }
      });
    }
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
      const populationCountField =
        this.dataset.currentSurvey.options.sitesMapVisualisation.filter(
          x => x.type === TKSiteMapVisualisationType.POPULATION_COUNT
        )[0]?.field || "";

      if (!this.map.getSource(TKMapSource.NOT_SELECTED_SITES)) {
        this.map.addSource(TKMapSource.NOT_SELECTED_SITES, {
          type: "geojson",
          data: this.mapSites.filteredSites.otherSites,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50,
          clusterProperties: {
            populationSum: ["+", ["get", populationCountField, ["properties"]]]
          }
        });
      }

      if (!this.map.getSource(TKMapSource.SELECTED_SITE)) {
        this.map.addSource(TKMapSource.SELECTED_SITE, {
          type: "geojson",
          data: this.mapSites.filteredSites.selectedSite
        });
      }
    }
    this.addAminLayers();
  }

  addAminLayers() {
    // ADD ADMIN BOUNDARIES
    if (!this.map.getLayer(COUNTRY_MASK)) {
      this.map.addLayer(this.mapLayerAdminStyle[COUNTRY_MASK] as FillLayer);
    }
    for (const level of TKConfigurationModule.configuration.spatial
      .adminLevelsMap) {
      this.map.addLayer(this.mapLayerAdminStyle[level]?.fill as FillLayer);
      this.map.addLayer(this.mapLayerAdminStyle[level]?.border as LineLayer);
    }
    if (this.visualisationMode === TKSiteMapVisualisationType.SITE_TYPES)
      this.addSiteTypesLayers();
    if (this.visualisationMode === TKSiteMapVisualisationType.POPULATION_COUNT)
      this.addSitePopulationCountLayers();
    this.mapBoundaries?.initLayersStyle(this.map);
  }

  removeSitesLayers() {
    if (this.map.getLayer(CLUSTERS_CIRCLE))
      this.map.removeLayer(CLUSTERS_CIRCLE);
    if (this.map.getLayer(CLUSTERS_COUNT)) this.map.removeLayer(CLUSTERS_COUNT);
    if (this.map.getLayer(NOT_SELECTED_SITES))
      this.map.removeLayer(NOT_SELECTED_SITES);
    if (this.map.getLayer(SELECTED_SITE)) this.map.removeLayer(SELECTED_SITE);
  }

  removeOtherVisualisationsLayers() {
    if (this.map.getLayer(POPULATION_COUNT_CLUSTERS_CIRCLE))
      this.map.removeLayer(POPULATION_COUNT_CLUSTERS_CIRCLE);
    if (this.map.getLayer(POPULATION_COUNT_CLUSTERS_COUNT))
      this.map.removeLayer(POPULATION_COUNT_CLUSTERS_COUNT);
    if (this.map.getLayer(SELECTED_SITE_POPULATION_CIRCLE))
      this.map.removeLayer(SELECTED_SITE_POPULATION_CIRCLE);
    if (this.map.getLayer(NOT_SELECTED_SITES_POPULATION_CIRCLE))
      this.map.removeLayer(NOT_SELECTED_SITES_POPULATION_CIRCLE);
    if (this.map.getLayer(SELECTED_SITE_POPULATION_COUNT))
      this.map.removeLayer(SELECTED_SITE_POPULATION_COUNT);
    if (this.map.getLayer(NOT_SELECTED_SITES_POPULATION_COUNT))
      this.map.removeLayer(NOT_SELECTED_SITES_POPULATION_COUNT);
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // Add Layers for visualisation by site types
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  addSiteTypesLayers() {
    this.removeOtherVisualisationsLayers();
    if (!this.mapVisualisationsLoaded[TKSiteMapVisualisationType.SITE_TYPES]) {
      // ADD CLUSTERS
      this.map.addLayer(
        this.mapLayerSiteTypesStyle[CLUSTERS_CIRCLE] as CircleLayer
      );
      this.map.addLayer(
        this.mapLayerSiteTypesStyle[CLUSTERS_COUNT] as SymbolLayer
      );
      this.map.addLayer(
        this.mapLayerSiteTypesStyle[NOT_SELECTED_SITES] as SymbolLayer
      );
      this.map.addLayer(
        this.mapLayerSiteTypesStyle[SELECTED_SITE] as SymbolLayer
      );

      // CLUSTERS BEHAVIOR
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
    } else {
      this.map.addLayer(
        this.mapLayerSiteTypesStyle[CLUSTERS_CIRCLE] as CircleLayer
      );
      this.map.addLayer(
        this.mapLayerSiteTypesStyle[CLUSTERS_COUNT] as SymbolLayer
      );
      this.map.addLayer(
        this.mapLayerSiteTypesStyle[NOT_SELECTED_SITES] as SymbolLayer
      );
      this.map.addLayer(
        this.mapLayerSiteTypesStyle[SELECTED_SITE] as SymbolLayer
      );
    }
    this.mapVisualisationsLoaded[TKSiteMapVisualisationType.SITE_TYPES] = true;
  }

  addSitePopulationCountLayers() {
    this.removeSitesLayers();
    if (
      !this.mapVisualisationsLoaded[TKSiteMapVisualisationType.POPULATION_COUNT]
    ) {
      // CLUSTERS BEHAVIOR
      this.map.on("click", POPULATION_COUNT_CLUSTERS_CIRCLE, e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [POPULATION_COUNT_CLUSTERS_CIRCLE as string]
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
      this.map.on("click", NOT_SELECTED_SITES_POPULATION_CIRCLE, e => {
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
      this.map.on("mouseenter", NOT_SELECTED_SITES_POPULATION_CIRCLE, e => {
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
      this.map.on("mouseleave", SELECTED_SITE_POPULATION_CIRCLE, () => {
        this.map.getCanvas().style.cursor = "";
        popup.remove();
      });
      this.map.on("mouseenter", SELECTED_SITE_POPULATION_CIRCLE, e => {
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
      this.map.on("mouseleave", NOT_SELECTED_SITES_POPULATION_CIRCLE, () => {
        this.map.getCanvas().style.cursor = "";
        popup.remove();
      });
    }

    this.map.addLayer(
      this.mapLayerPopulationCountStyle[
        POPULATION_COUNT_CLUSTERS_CIRCLE
      ] as CircleLayer
    );
    this.map.addLayer(
      this.mapLayerPopulationCountStyle[
        POPULATION_COUNT_CLUSTERS_COUNT
      ] as SymbolLayer
    );
    this.map.addLayer(
      this.mapLayerPopulationCountStyle[
        SELECTED_SITE_POPULATION_CIRCLE
      ] as CircleLayer
    );
    this.map.addLayer(
      this.mapLayerPopulationCountStyle[
        NOT_SELECTED_SITES_POPULATION_CIRCLE
      ] as CircleLayer
    );
    this.map.addLayer(
      this.mapLayerPopulationCountStyle[
        SELECTED_SITE_POPULATION_COUNT
      ] as SymbolLayer
    );
    this.map.addLayer(
      this.mapLayerPopulationCountStyle[
        NOT_SELECTED_SITES_POPULATION_COUNT
      ] as SymbolLayer
    );

    this.mapVisualisationsLoaded[
      TKSiteMapVisualisationType.POPULATION_COUNT
    ] = true;
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
