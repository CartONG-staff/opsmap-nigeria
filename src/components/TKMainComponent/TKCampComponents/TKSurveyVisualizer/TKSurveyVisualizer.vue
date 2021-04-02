<template lang="html">
  <div class="tk-survey-visualizer">
    <TKSurveyThematic
      :title="thematic1.name"
      :icon_name="thematic1.iconOchaName"
    />
    <TKSurveyThematic
      :title="thematic2.name"
      :icon_name="thematic2.iconOchaName"
    />
    <TKSurveyThematic
      :title="thematic3.name"
      :icon_name="thematic3.iconOchaName"
    />
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
export default class TKSurveyVisualizer extends Vue {
  thematic1 = {
    name: "avions",
    iconOchaName: "Airport"
  };

  thematic2 = {
    name: "agile",
    iconOchaName: "Agile"
  };

  thematic3 = {
    name: "confinés",
    iconOchaName: "Confined"
  };
}
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
