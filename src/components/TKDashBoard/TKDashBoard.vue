<template>
  <div class="tk-dashboard">
    <v-btn v-on:click="switchPage()">Switch page</v-btn>
    <div v-if="isHomePage" class="tk-homepage"></div>
    <div v-if="!isHomePage" class="tk-dashboard" visible="false">
      <TKCampSelector />
      <TKSurveyVisualizer />
    </div>
  </div>
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

<style>
.tk-dashboard {
  background-image: url("https://streetartutopia.com/wp-content/uploads/2019/12/BANKSY-Bench-Birmingham_Moment.jpg");
  background-size: 100% 100%;
}
</style>
