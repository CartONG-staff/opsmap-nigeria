<template lang="html">
  <div class="tk-submission-visualizer">
    <div class="tk-submission-visualizer-col">
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionCccm"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionCom"
      />
      <!-- <TKSurveyThematic :submissionThematic="submissionDemo" /> -->
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionEducation"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionSports"
      />
    </div>
    <div class="tk-submission-visualizer-col">
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionEnvironment"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionGeneralInfo"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionHealth"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionInfrastructure"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionWash"
      />
    </div>
    <div class="tk-submission-visualizer-col">
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionInteriorisation"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionNonfood"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionProtection"
      />
      <TKSubmissionThematicView
        :options="options"
        :submissionThematic="submissionSecurity"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import TKSubmissionThematicView from "./TKSubmissionThematicView.vue";
import { TKSubmission } from "@/domain/core/TKSubmission";
import { TKSubmissionThematic } from "@/domain/core/TKSubmissionThematic";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizerOptions";

@Component({
  components: {
    TKSubmissionThematicView
  }
})
export default class TKSubmissionVisualizer extends Vue {
  @Prop()
  readonly submission!: TKSubmission;

  @Prop()
  readonly options!: TKSubmissionVisualizerOptions;

  submissionCccm!: TKSubmissionThematic;
  submissionCom!: TKSubmissionThematic;
  submissionDemo!: TKSubmissionThematic;
  submissionEducation!: TKSubmissionThematic;
  submissionEnvironment!: TKSubmissionThematic;
  submissionGeneralInfo!: TKSubmissionThematic;
  submissionHealth!: TKSubmissionThematic;
  submissionInfrastructure!: TKSubmissionThematic;
  submissionInteriorisation!: TKSubmissionThematic;
  submissionNonfood!: TKSubmissionThematic;
  submissionProtection!: TKSubmissionThematic;
  submissionSecurity!: TKSubmissionThematic;
  submissionSports!: TKSubmissionThematic;
  submissionWash!: TKSubmissionThematic;

  @Watch("submission", { immediate: true })
  onSurveyChanged() {
    if (this.submission) {
      this.submissionCccm = this.submission.thematics["group_cccm"];
      this.submissionCom = this.submission.thematics["group_com"];
      this.submissionDemo = this.submission.thematics["group_demo"];
      this.submissionEducation = this.submission.thematics["group_education"];
      this.submissionEnvironment = this.submission.thematics["group_environment"];
      this.submissionGeneralInfo = this.submission.thematics["group_general_info"];
      this.submissionHealth = this.submission.thematics["group_health"];
      this.submissionInfrastructure = this.submission.thematics["group_infrastructure"];
      this.submissionInteriorisation = this.submission.thematics["group_interiorisation"];
      this.submissionNonfood = this.submission.thematics["group_nonfood"];
      this.submissionProtection = this.submission.thematics["group_protection"];
      this.submissionSecurity = this.submission.thematics["group_security"];
      this.submissionSports = this.submission.thematics["group_sports"];
      this.submissionWash = this.submission.thematics["group_wash"];
    }
  }
}
</script>

<style scoped>
.tk-submission-visualizer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
}

.tk-submission-visualizer-col {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
  row-gap: 25px;
}
</style>
