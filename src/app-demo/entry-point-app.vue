<template>
  <v-app>
    <v-main>
      <div class="tk-loader" v-if="!dataLoaded">
        <h2 color="primary">
          ...Je mouline, je vais chercher les 40 Go de données sur le serveur du
          HCR, patience...
        </h2>
      </div>
      <div class="tk-main" v-if="dataLoaded">
        <TKHeader :appConfig="appConfig" />
        <TKMainComponent
          class="tk-main-dashboard"
          :dataset="dataset"
          :geoData="geoDataset"
        />
        <TKFooter :appConfig="appConfig" />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";
import { APPCONFIG } from "@/app-demo/config";
import { TKFooter, TKMainComponent, TKHeader } from "@/components"; // @ is an alias to /src
import { TKCreateSurveyCollection } from "@/domain/survey/TKCreateSurveyCollection";
import { TKDatasetFilterer } from "@/domain/core/TKFilters";
import { TKGetGeoBoundaries } from "@/domain/map/TKGetGeoBoundaries";
import { TKGeoDataset } from "@/domain/core/TKGeoDataset";

@Component({
  components: {
    TKHeader,
    TKFooter,
    TKMainComponent,
  },
})
export default class App extends Vue {
  private appConfig: TKGeneralConfiguration = APPCONFIG;
  dataLoaded = false;
  dataset: TKDatasetFilterer | null = null;
  geoDataset: TKGeoDataset | null = null;

  async mounted() {
    const surveys = await TKCreateSurveyCollection(
      this.appConfig.surveyDescription,
      this.appConfig.surveyFormat,
      this.appConfig.spatialDescription,
      this.appConfig.indicatorsDescription,
      this.appConfig.language
    );

    const geoBoundaries = await TKGetGeoBoundaries(
      surveys,
      this.appConfig.iso3
    );

    this.geoDataset = geoBoundaries;
    this.dataset = new TKDatasetFilterer(surveys);
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
