<template lang="html">
  <div class="tk-survey-visualizer">
    <TKSurveyThematic />
    <TKSurveyThematic />
    <TKSurveyThematic />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import TKSurveyThematic from "./TKSurveyThematic.vue";

@Component({
  components: {
    TKSurveyThematic
  }
})
export default class TKSurveyVisualizer extends Vue {}
</script>

<style scoped>
.tk-survey-visualizer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
}

.tk-survey-visualizer > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
}
</style>
