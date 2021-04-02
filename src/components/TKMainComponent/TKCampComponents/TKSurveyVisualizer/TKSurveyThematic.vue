<template lang="html">
  <div class="tk-survey-thematic">
    TKSurveyThematic
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class TKSurveyThematic extends Vue {}
</script>

<style scoped>
.tk-survey-thematic {
  background-color: aquamarine;
  border-radius: 15px;
  min-height: 100px;
}
</style>
