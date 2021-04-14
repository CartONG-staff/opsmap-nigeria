<template lang="html">
  <div class="tk-survey-visualizer">
    <div class="tk-survey-visualizer-col">
      <TKSubmissionThematicView :submissionThematic="surveyCccm" />
      <TKSubmissionThematicView :submissionThematic="surveyCom" />
      <!-- <TKSurveyThematic :submissionThematic="surveyDemo" /> -->
      <TKSubmissionThematicView :submissionThematic="surveyEducation" />
      <TKSubmissionThematicView :submissionThematic="surveySports" />
    </div>
    <div class="tk-survey-visualizer-col">
      <TKSubmissionThematicView :submissionThematic="surveyEnvironment" />
      <TKSubmissionThematicView :submissionThematic="surveyGeneralInfo" />
      <TKSubmissionThematicView :submissionThematic="surveyHealth" />
      <TKSubmissionThematicView :submissionThematic="surveyInfrastructure" />
      <TKSubmissionThematicView :submissionThematic="surveyWash" />
    </div>
    <div class="tk-survey-visualizer-col">
      <TKSubmissionThematicView :submissionThematic="surveyInteriorisation" />
      <TKSubmissionThematicView :submissionThematic="surveyNonfood" />
      <TKSubmissionThematicView :submissionThematic="surveyProtection" />
      <TKSubmissionThematicView :submissionThematic="surveySecurity" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import TKSubmissionThematicView from "./TKSubmissionThematicView.vue";
import { TKSubmissions } from "@/domain/core/TKSubmissions";

@Component({
  components: {
    TKSubmissionThematicView
  }
})
export default class TKSurveyVisualizer extends Vue {
  @Prop()
  readonly survey!: TKSubmissions;

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
    if (this.survey) {
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
    }
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
  row-gap: 25px;
}
</style>
