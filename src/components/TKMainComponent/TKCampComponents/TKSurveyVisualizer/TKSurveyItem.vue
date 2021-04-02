<template lang="html">
  <div class="tk-survey-item-container"></div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { TKSurveyItemI } from "./TKSurveyItemI";

@Component
export default class TKSurveyItem extends Vue {
  @Prop()
  readonly item!: TKSurveyItemI;
}
</script>

<style scoped></style>
