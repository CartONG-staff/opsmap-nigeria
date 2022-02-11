<template>
  <div>
    <TKSubmissionVisualizer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKSubmissionVisualizer } from "./TKCampComponents";
@Component({
  components: {
    TKSubmissionVisualizer
  }
})
export default class TKMainComponentLeftCamp extends Vue {}
</script>

<style scoped></style>
