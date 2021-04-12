<template lang="html">
  <div class="tk-survey-visualizer">
    <div class="tk-survey-visualizer-col">
      <TKSurveyThematic :survey="surveyCccm" />
      <TKSurveyThematic :survey="surveyCom" />
      <TKSurveyThematic :survey="surveyDemo" />
      <TKSurveyThematic :survey="surveyEducation" />
      <TKSurveyThematic :survey="surveySports" />
    </div>
    <div class="tk-survey-visualizer-col">
      <TKSurveyThematic :survey="surveyEnvironment" />
      <TKSurveyThematic :survey="surveyGeneralInfo" />
      <TKSurveyThematic :survey="surveyHealth" />
      <TKSurveyThematic :survey="surveyInfrastructure" />
      <TKSurveyThematic :survey="surveyWash" />
    </div>
    <div class="tk-survey-visualizer-col">
      <TKSurveyThematic :survey="surveyInteriorisation" />
      <TKSurveyThematic :survey="surveyNonfood" />
      <TKSurveyThematic :survey="surveyProtection" />
      <TKSurveyThematic :survey="surveySecurity" />
    </div>
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

  surveyCccm: object = {};
  surveyCom: object = {};
  surveyDemo: object = {};
  surveyEducation: object = {};
  surveyEnvironment: object = {};
  surveyGeneralInfo: object = {};
  surveyHealth: object = {};
  surveyInfrastructure: object = {};
  surveyInteriorisation: object = {};
  surveyNonfood: object = {};
  surveyProtection: object = {};
  surveySecurity: object = {};
  surveySports: object = {};
  surveyWash: object = {};

  @Watch("survey", { immediate: true })
  onSurveyChanged() {
    const keys = Object.keys(this.survey);
    const surv = this.survey[keys[0]];
    this.surveyCccm = surv["group_cccm"];
    this.surveyCom = surv["group_com"];
    this.surveyDemo = surv["group_demo"];
    this.surveyEducation = surv["group_education"];
    this.surveyEnvironment = surv["group_environment"];
    this.surveyGeneralInfo = surv["group_general_info"];
    this.surveyHealth = surv["group_health"];
    this.surveyInfrastructure = surv["group_infrastructure"];
    this.surveyInteriorisation = surv["group_interiorisation"];
    this.surveyNonfood = surv["group_nonfood"];
    this.surveyProtection = surv["group_protection"];
    this.surveySecurity = surv["group_security"];
    this.surveySports = surv["group_sports"];
    this.surveyWash = surv["group_wash"];
    console.log(surv);
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

.tk-survey-visualizer-col {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
  row-gap: 25px;;
}
</style>
