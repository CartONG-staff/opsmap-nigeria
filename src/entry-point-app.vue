<template>
  <v-app>
    <v-main>
      <TKHeader />
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
export default class App extends Vue {}
</script>

<style>
body {
  min-height: 100vh; /* toute la hauteur du viewport (compatible IE9+) */
}</style>
