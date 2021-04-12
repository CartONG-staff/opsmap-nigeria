<template lang="html">
  <div class="tk-survey-visualizer">
    <TKSurveyThematic :survey="survey1" />
    <TKSurveyThematic :survey="survey2" />
    <TKSurveyThematic :survey="survey3" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import TKSurveyThematic from "./TKSurveyThematic.vue";

@Component({
  components: {
    TKSurveyThematic
  }
})
export default class TKSurveyVisualizer extends Vue {
  @Prop({ default: {} })
  readonly survey!: { [key: string]: { [key: string]: object } };

  survey1: object = {};
  survey2: object = {};
  survey3: object = {};

  @Watch("survey", { immediate: true })
  onSurveyChanged() {
    console.log(this.survey);
    const keys = Object.keys(this.survey);
    const surv = this.survey[keys[0]];
    this.survey1 = surv["group_cccm"];
    this.survey2 = surv["group_education"];
    this.survey3 = surv["group_health"];
  }
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
  width: 30%;
}
</style>
