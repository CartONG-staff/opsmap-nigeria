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

    const itemsCount = [0, 0, 0];

    if (this.submission) {
      for (const them in this.submission.thematics) {
        let index = 0;
        if (itemsCount[1] < itemsCount[0] && itemsCount[1] <= itemsCount[2]) {
          index = 1;
        } else if (
          itemsCount[2] < itemsCount[1] &&
          itemsCount[2] < itemsCount[0]
        ) {
          index = 2;
        }
        this.columns[index].push(this.submission.thematics[them]);
        itemsCount[index] += this.submission.thematics[them].data.length;
      }
    }
    this.$forceUpdate();
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
