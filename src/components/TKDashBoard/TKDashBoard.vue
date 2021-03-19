<template>
  <v-container fluid>
    <button v-on:click="switchPage()">Switch</button>
    <div v-if="isHomePage" class="tk-homepage">
      <TKSurveyVisualizer />
    </div>
    <div v-if="!isHomePage" class="tk-dashboard" visible="false">
      <TKCampSelector />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import TKCampSelector from "./TKCampSelector";
import TKSurveyVisualizer from "./TKSurveyVisualizer";

@Component({
  components: {
    TKCampSelector,
    TKSurveyVisualizer,
  },
})
export default class TKDashBoard extends Vue {
  isHomePage = true;

  // Component method
  switchPage() {
    this.isHomePage = !this.isHomePage;
  }
}
</script>

<style></style>
