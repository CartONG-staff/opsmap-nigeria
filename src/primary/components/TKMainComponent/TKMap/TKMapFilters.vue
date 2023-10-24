<!-- eslint-disable vue/no-parsing-error -->
<template lang="html">
  <div class="tk-map-filters" ref="tk-map-filters">
    <transition name="hide-filters">
      <div class="tk-map-filters-items-container">
        <div
          class="tk-map-filters-selectors"
          v-if="visualisationMode.length > 1"
        >
          <v-radio-group
            v-model="mapVisualisation"
            row
            dense
            class="tk-map-filters-radio"
          >
            <v-radio
              v-for="visualisation in visualisationMode"
              :key="visualisation"
              :label="$t(`map.${visualisation}`)"
              :value="visualisation"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-if="show" class="tk-map-filters-item">
          <template v-if="mapVisualisation === 'siteTypes'">
            <div v-for="(site, key) in sites" :key="key" class="tk-map-filter">
              <img
                :class="
                  site.enabled
                    ? 'tk-indicator-icon'
                    : 'tk-indicator-icon tk-indicator-icon-disabled'
                "
                :src="site.iconUrl"
              />
              <transition mode="out-in" name="fade-in">
                <div
                  :key="$root.$i18n.locale"
                  :class="
                    site.enabled
                      ? 'tk-map-filter-text'
                      : 'tk-map-filter-text tk-map-filter-text-disabled'
                  "
                >
                  {{ text(site.title) }}
                </div>
              </transition>
              <transition mode="out-in" name="fade-in">
                <div
                  :key="site.count"
                  :class="
                    site.enabled
                      ? 'tk-map-filter-value'
                      : 'tk-map-filter-value tk-map-filter-value-disabled'
                  "
                >
                  {{ site.count }}
                </div>
              </transition>
              <v-checkbox
                v-model="site.active"
                class="tk-map-filter-checkbox"
                hide-details
                :disabled="!site.enabled"
                @change="checkboxChange(site.type, site.active)"
              ></v-checkbox>
            </div>
          </template>
          <template v-if="mapVisualisation === 'populationCount'">
            <div class="tk-map-filter mb-2">
              <div class="tk-population-count-cluster">x</div>
              <div class="">{{ $t("map.legend.populationCluster") }}</div>
            </div>
            <div class="tk-map-filter mb-2">
              <div class="tk-population-count-not-selected-site">x</div>
              <div class="">{{ $t("map.legend.populationNotSelectedSite") }}</div>
            </div>
            <div class="tk-map-filter mb-2">
              <div class="tk-population-count-selected-site">x</div>
              <div class="">{{ $t("map.legend.populationSelectedSite") }}</div>
            </div>
          </template>
        </div>
      </div>
    </transition>
    <div class="tk-vseparator" />
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          color="primary"
          @click="show = !show"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-map-legend</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("map.legendFilters") }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { TKIconUrl } from "@/domain/utils/TKIconUrl";
import { Component, Vue, Watch } from "vue-property-decorator";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";
import { MapLegendDisplayStyle } from "@/domain/opsmapConfig/TKOpsmapConfiguration";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";;
import { TKSiteMapVisualisationType } from "@/domain/survey/TKSurveyMapVisualisation";

@Component
export default class TKMapFilter extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }

  get mapVisualisation(): TKSiteMapVisualisationType {
    return TKVisualizerOptionsModule.mapVisualisation;
  }

  set mapVisualisation(visualisation: TKSiteMapVisualisationType) {
    TKVisualizerOptionsModule.setMapVisualisation(visualisation);
  }

  visualisationMode = [TKSiteMapVisualisationType.SITE_TYPES];

  sites: Array<{
    type: string;
    title: TKLabel;
    iconUrl: string;
    active: boolean;
    enabled: boolean;
    count: number;
  }> = [];

  mounted() {
    this.updateSites();
    if (this.dataset.currentSurvey.options.sitesMapVisualisation.length > 0) {
      this.visualisationMode.push(
        ...this.dataset.currentSurvey.options.sitesMapVisualisation.map(
          x => x.type
        )
      );
    }
  }

  checkboxChange(type: string, active: boolean): void {
    this.dataset.setTypedFilterValue(type, active);
  }

  @Watch("dataset.currentSurvey", { immediate: true })
  updateSites() {
    this.sites = [];
    if (this.dataset && this.dataset.currentSurvey) {
      for (const siteKeys of Object.keys(
        this.dataset.currentSurvey.fdf.siteTypes
      )) {
        const site = this.dataset.currentSurvey.fdf.siteTypes[siteKeys];
        this.sites.push({
          type: site.id,
          title: site.thematicLabel,
          iconUrl: TKIconUrl(site.iconFileName.normal),
          active: true,
          enabled: true,
          count: 0
        });
      }
      this.updateCount();
    }
    // if (this.$refs["tk-map-filters"]) {
    //   (this.$refs["tk-map-filters"] as HTMLBaseElement).style.height = `${this
    //     .sites.length * 34}px`;
    // }
  }

  text(label: TKLabel): string {
    return TKGetLocalValue(label, this.$root.$i18n.locale);
  }

  show =
    TKConfigurationModule.configuration.options.mapLegendDisplayStyle ===
    MapLegendDisplayStyle.DEFAULT;

  @Watch("dataset.filteredSitesList", { immediate: true })
  updateCount() {
    for (let idx = 0; idx < this.sites.length; idx++) {
      this.sites[idx].count = this.dataset.filteredSitesList.filter(
        site => site.type.id === this.sites[idx].type
      ).length;
    }
  }
}
</script>
<style scoped>
.tk-map-filters {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--v-border-base);
  background-color: var(--v-background-base);
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  /* row-gap: 10px; */
}

/* .tk-map-filters-selectors{
  display: flex;
  flex-direction: column nowrap;
} */

.tk-map-filters-items-container {
  display: block;
  margin: 10px;
}

.tk-map-filters-item {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  /* row-gap: 10px; */
  flex-grow: 1;
  opacity: 1;
  overflow: hidden;
}

.hide-filters-enter-active,
.hide-filters-leave-active {
  transition: all 0.5s ease;
}
.hide-filters-enter,
.hide-filters-leave-to {
  max-width: 0px;
  opacity: 0;
}

.tk-map-filter {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  column-gap: 10px;
}

.tk-map-filter-text {
  flex-grow: 1;
  font-size: 13px;
  white-space: nowrap;
}

.tk-map-filter-text-disabled,
.tk-map-filter-value-disabled {
  color: var(--v-disabled-base);
}

.tk-map-filter-checkbox {
  padding: 0px;
  margin: auto;
}

.tk-indicator-icon {
  display: block;
  width: 20px;
  height: 20px;
  margin-left: 5px;
}

.tk-indicator-icon-disabled {
  filter: grayscale(1);
}

.tk-population-count-cluster {
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: rgba(236, 107, 77, 0.8);
  display: flex;
  justify-content: center;
  font-weight: 600;
}

.tk-population-count-not-selected-site {
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: rgba(27, 101, 124, 0.8);
  display: flex;
  justify-content: center;
  font-weight: 600;
}

.tk-population-count-selected-site {
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background-color: rgba(27, 101, 124, 0.8);
  border: 2px black solid;
  display: flex;
  justify-content: center;
  font-weight: 600;
}

.tk-vseparator {
  background-color: var(--v-border-base);
  width: 1px;
  height: 100%;
  margin-left: -1px;
}

.tk-map-filters-radio {
  margin: 0px !important;
  padding: 0px !important;
}

.tk-map-filters-radio .v-input__control .v-messages {
  display: none !important;
}
</style>
