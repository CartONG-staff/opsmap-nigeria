<template>
  <v-app>
    <v-main>
      <div class="tk-main">
        <TKHeader :appConfig="appConfig" />
        <TKMainComponent class="tk-main-dashboard" :appConfig="appConfig" />
        <TKFooter :appConfig="appConfig" />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";
import { APPCONFIG } from "@/app-demo/config";

import { TKFooter, TKMainComponent, TKHeader } from "@/components"; // @ is an alias to /src
import { TKDatasetBuilder } from "@/domain/Data/Survey/TKDatasetBuilder";

@Component({
  components: {
    TKHeader,
    TKFooter,
    TKMainComponent
  }
})
export default class App extends Vue {
  private appConfig: TKGeneralConfiguration = APPCONFIG;
  async mounted() {
    TKDatasetBuilder(
      this.appConfig.surveyDescription,
      this.appConfig.surveyFormat
    );
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

<style > .tk-autocomplete input {
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
