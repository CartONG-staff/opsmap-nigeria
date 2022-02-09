<template>
  <div class="tk-camp-left">
    <TKCampSubtitle />
    <TKCampToolbar
      :visualizerOptions="visualizerOptions"
      :pdfInfos="pdfInfos"
    />
    <TKCampInfos />
  </div>
</template>

<script lang="ts">
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
