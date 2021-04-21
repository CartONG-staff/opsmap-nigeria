<template>
  <v-app>
    <v-main>
      <div class="tk-loader" v-if="!dataLoaded">
        <h2 color="primary">
          ...Loading Application...
        </h2>
      </div>
      <div class="tk-main" v-if="dataLoaded">
        <TKHeader :appConfig="appRootConfig" />
        <TKMainComponent
          class="tk-main-dashboard"
          :dataset="dataset"
          :geoData="geoDataset"
          :appConfig="appRootConfig"
        />
        <TKFooter :appConfig="appRootConfig" />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKFooter, TKMainComponent, TKHeader } from "@/components";
import { TKDatasetFilterer } from "@/domain/survey/TKFilters";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKCreateSurveyCollection } from "@/domain/survey/TKSurveyCollection";
import { TKGetGeoBoundaries } from "@/domain/map/TKGetGeoBoundaries";
import { TKOpsmapConfiguration } from "@/domain";
import { TKReadGeneralConfiguration } from "@/domain/opsmapConfig/TKOpsmapConfiguration";
@Component({
  components: {
    TKHeader,
    TKFooter,
    TKMainComponent,
  },
})
export default class App extends Vue {
  appRootConfig!: TKOpsmapConfiguration;
  dataLoaded = false;
  dataset: TKDatasetFilterer | null = null;
  geoDataset: TKGeoDataset | null = null;

  async mounted() {
    this.appRootConfig = await TKReadGeneralConfiguration(
      "general_config",
      "brazil"
    );
    const surveys = await TKCreateSurveyCollection(
      this.appRootConfig.surveyDescription,
      this.appRootConfig.spatialDescription,
      this.appRootConfig.indicatorsDescription
    );
    this.geoDataset = null;
    if (this.appRootConfig.spatialDescription.useBoundariesMasks) {
      this.geoDataset = await TKGetGeoBoundaries(
        surveys,
        this.appRootConfig.iso3
      );
    }
    this.dataset = new TKDatasetFilterer(surveys);

    console.log(this.dataset);

    this.dataLoaded = true;
  }
}
</script>

<style>
body {
  min-height: 100vh; /* toute la hauteur du viewport (compatible IE9+) */
  --padding-small: 5px;
  --padding-medium: 10px;
  --padding-large: 15px;
  --side-padding: 10%;

  font-family: "Arial";
  font-size: 16px;
}

h3 {
  font-family: "Arial";
  font-size: 18px;
  letter-spacing: 1.5px;
}

.tk-loader {
  display: flex;
  min-height: 100%;
  min-width: 100%;
  justify-content: center;
  align-items: center;
}

.tk-main {
  display: flex;
  flex-flow: column nowrap;
  row-gap: 0px;
  height: 100%;
  width: 100%;
}

.tk-main-dashboard {
  flex-grow: 2;
}

.v-ripple__container {
  display: none !important;
}

.tk-autocomplete input {
  color: #000 !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 16px !important;
}

.tk-autocomplete input::placeholder {
  color: #000 !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 16px !important;
}

.tk-autocomplete .theme--light.v-icon {
  color: #d8d8d8 !important;
}

.tk-autocomplete .v-input__slot {
  border-color: #d8d8d8 !important;
  transition: none !important;
}

.tk-autocomplete .v-input__slot:before {
  border-color: #d8d8d8 !important;
  transition: none !important;
}

.tk-autocomplete .v-input__slot:after {
  border-color: #d8d8d8 !important;
  transition: none !important;
}
</style>
