<template>
  <div class="tk-camp-subtitle">
    <div v-show="name !== ''" class="tk-camp-subtitle">
      {{ name }}
    </div>
    <div v-show="name === ''" class="tk-camp-subtitle-placeholder">
      {{ $t("site.subtitlePlaceholder") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { TKDatasetFilterer } from "@/domain/survey/TKFilters";

@Component
export default class TKCampSubtitle extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  name = "";
  @Watch("dataset", { immediate: true, deep: true })
  onChange() {
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

.tk-camp-subtitle-placeholder {
  color: var(--v-campTitle-base);
  font-size: 30px;
  line-height: 1.467;
}
</style>
