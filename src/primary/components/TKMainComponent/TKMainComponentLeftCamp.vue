<template>
  <div class="tk-camp-left">
    <TKCampSubtitle :dataset="dataset" />
    <TKCampToolbar
      :dataset="dataset"
      :visualizerOptions="visualizerOptions"
      :pdfInfos="pdfInfos"
    />
    <TKCampInfos :dataset="dataset" />
  </div>
</template>

<script lang="ts">
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKPDFInfos } from "@/domain/survey/TKPDFInfos";
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  TKCampInfos,
  TKCampSubtitle,
  TKCampToolbar,
  TKSubmissionVisualizerOptions
} from "./TKCampComponents";
@Component({
  components: {
    TKCampInfos,
    TKCampSubtitle,
    TKCampToolbar
  }
})
export default class TKMainComponentLeftHome extends Vue {
  @Prop()
  readonly dataset!: TKDataset;

  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly pdfInfos!: TKPDFInfos;
}
</script>

<style scoped>
.tk-camp-left {
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: top;
  width: 100%;
  justify-content: space-between;
}
</style>
