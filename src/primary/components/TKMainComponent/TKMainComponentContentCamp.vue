<template>
  <div>
    <TKSubmissionVisualizerToolbar class="toolbar" />
    <TKSubmissionVisualizer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  TKSubmissionVisualizer,
  TKSubmissionVisualizerToolbar
} from "./TKCampComponents";
@Component({
  components: {
    TKSubmissionVisualizer,
    TKSubmissionVisualizerToolbar
  }
})
export default class TKMainComponentContentCamp extends Vue {}
</script>

<style scoped>
.toolbar {
  margin-bottom: 20px;
}
</style>
