<template>
  <div class="tk-dashboard">
    <TKCampSelector />
    <TKSurveyVisualizer />
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
export default class TKCampPage extends Vue {}
</script>

<style></style>
