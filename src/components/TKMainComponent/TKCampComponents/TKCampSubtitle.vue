<template>
  <div class="tk-camp-subtitle">
    {{ name }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { TKDatasetFilterer } from "@/domain/core/TKFilters";

@Component
export default class TKCampSubtitle extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  name = "";
  @Watch("dataset", { deep: true })
  onChange() {
    console.log("change somewhere");

    this.name = this.dataset.currentCamp ? this.dataset.currentCamp.name : "";
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
