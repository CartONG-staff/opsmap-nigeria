<template>
  <div class="tk-site-subtitle">
    <transition mode="out-in" name="fade-in">
      <div :key="name" class="tk-site-subtitle">
        {{ name }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { Component, Vue, Watch } from "vue-property-decorator";
@Component
export default class TKSiteSubtitle extends Vue {
  name = "";
  get dataset() {
    return TKDatasetModule.dataset;
  }

  @Watch("$root.$i18n.locale")
  @Watch("dataset.currentSite", { immediate: true })
  onChange() {
    this.name = this.dataset.currentSite
      ? TKGetLocalValue(this.dataset.currentSite.label, this.$root.$i18n.locale)
      : this.$root.$i18n.t("site.subtitlePlaceholder").toString();
  }
}
</script>

<style scoped>
.tk-site-subtitle {
  font-size: 30px;
  line-height: 1.467;
}

.tk-site-subtitle-placeholder {
  font-size: 30px;
  line-height: 1.467;
}
</style>
