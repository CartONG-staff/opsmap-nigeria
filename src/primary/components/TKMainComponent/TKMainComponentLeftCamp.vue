<template>
  <div class="tk-camp-left">
    <TKCampSubtitle />
    <TKCampToolbar :visualizerOptions="visualizerOptions" />
    <TKCampInfos />
  </div>
</template>

<script lang="ts">
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
