<template>
  <v-app>
    <v-main>
      <TKHeader :opsmapName="opsmapName" :partners="partners" />
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
import { TKPartnerInfos, PARTNERS } from "@/domain/TKPartnerInfos";
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
  readonly opsmapName = "Syldavie";
  readonly partners: Array<TKPartnerInfos> = PARTNERS;
}
</script>

<style>
body {
  min-height: 100vh; /* toute la hauteur du viewport (compatible IE9+) */
}
</style>
