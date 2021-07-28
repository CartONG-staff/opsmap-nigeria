<template>
  <div class="indicators-container">
    <div
      class="indicator"
      v-for="(indicator, index) in indicators"
      :indicator="indicator"
      :key="index"
    >
      <div class="indicator-container">
        <div class="indicator-icon-container">
          <img class="indicator-icon" :src="indicator.iconUrl" />
        </div>
        <div class="indicator-value">
          <div class="indicator-value-number">
            {{ indicator.value }}
          </div>
          <div class="indicator-value-decription">
            {{ indicator.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  components: {}
})
export default class TKSubmissionToPDFIndicator extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;

  indicators: Array<{
    iconUrl: string;
    name: string;
    value: string;
  }> = [];

  @Watch("$root.$i18n.locale", { immediate: true })
  @Watch("dataset.currentSubmission", { immediate: true })
  indicatorChanged() {
    if (this.dataset && this.dataset.currentSubmission) {
      this.indicators = this.dataset.currentSubmission.indicators.map(item => {
        return {
          iconUrl: TKIconUrl(item.iconOchaName),
          name: TKGetLocalValue(item.nameLabel, this.$root.$i18n.locale),
          value: TKGetLocalValue(item.valueLabel, this.$root.$i18n.locale)
        };
      });
    } else {
      this.indicators = [];
    }
  }
}
</script>

<style scoped>
/* INDICATORS ********************************************************/
.indicators-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: top;
}

.indicator {
  height: 20mm;
  width: 60mm;
  border-radius: 15px;
}

.indicator-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  column-gap: 5mm;
  padding: 5mm;
  align-items: left;
  width: 100%;
}

.indicator-value {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: left;
  height: 100%;
  width: 100%;
}

.indicator-value-number {
  width: 100%;
  color: var(--v-accent-base);
  font-size: 16pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicator-value-decription {
  font-size: 12px;
  font-weight: bold;
  color: #999;
  letter-spacing: 0.86;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicator-icon-container {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.indicator-icon {
  height: 6mm;
  width: auto;
}
</style>
