<template>
  <v-app>
    <v-main>
      <TKHeader :country="country" :partners="partners" />
      <v-container fluid>
        <TKCampSelector />
        <TKSurveyVisualizer />
      </v-container>
      <TKFooter />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKPartnerInfos } from "@/domain/TKPartnerInfos";
import { TKCountry } from "@/domain/TKCountry";

import { SYLDAVIE, PARTNERS } from "@/domain/sampleTest";

import {
  TKHeader,
  TKFooter,
  TKCampSelector,
  TKSurveyVisualizer
} from "@/components"; // @ is an alias to /src

@Component({
  components: {
    TKCampSelector,
    TKHeader,
    TKFooter,
    TKSurveyVisualizer
  }
})
export default class App extends Vue {
  readonly country: TKCountry = SYLDAVIE;
  readonly partners: Array<TKPartnerInfos> = PARTNERS;
}
</script>

<style>
body {
  min-height: 100vh; /* toute la hauteur du viewport (compatible IE9+) */
}
</style>
