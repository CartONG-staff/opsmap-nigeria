<template>
  <div class="tk-camp-subtitle">
    {{ name }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { CampDescription } from "@/domain/data/survey/merged_dataset/TKSubmissionsByCampsGrouper";

@Component
export default class TKCampSubtitle extends Vue {
  @Prop()
  readonly camp!: CampDescription;

  name = "";

  @Watch("camp", { immediate: true })
  onChange() {
    this.name = this.camp ? this.camp.name : "";
  }
}
</script>

<style scoped>
.tk-camp-subtitle {
  color: var(--v-campTitle-base);
  font-size: 30px;
  line-height: 1.467;
}
</style>
