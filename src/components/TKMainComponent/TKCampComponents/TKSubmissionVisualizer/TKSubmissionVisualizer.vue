<template lang="html">
  <div class="tk-submission-visualizer">
    <div
      v-for="(col, indexcol) in columns"
      :key="indexcol"
      class="tk-submission-visualizer-col"
    >
      <TKSubmissionThematicView
        v-for="(them, indexthem) in col"
        :key="indexthem"
        :options="options"
        :submissionThematic="them"
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

  columns: [
    Array<TKSubmissionThematic>,
    Array<TKSubmissionThematic>,
    Array<TKSubmissionThematic>
  ] = [[], [], []];

  @Watch("submission", { immediate: true })
  onSurveyChanged() {
    this.columns[0] = [];
    this.columns[1] = [];
    this.columns[2] = [];
    if (this.submission) {
      let count = 0;
      for (const them in this.submission.thematics) {
        this.columns[count].push(this.submission.thematics[them]);
        count++;
        count = count % 3;
      }
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
