<template lang="html">
  <div class="tk-submission-thematic-container">
    <div class="tk-submission-thematic-header">
      <TKSubmissionThematicTrafficLightComponent :trafficLight="trafficLight" />
      <transition mode="out-in" name="fade-in">
        <div :key="title" class="tk-submission-thematic-title">{{ title }}</div>
      </transition>
      <img class="tk-submission-icon" :src="iconurl" />
    </div>
    <div class="tk-submission-thematic-content">
      <div v-for="(entry, key) in entries" :key="key">
        <TKSubmissionEntryView
          :entry="entry"
          v-if="!hideUnanswered || (hideUnanswered && entry.isAnswered)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKIconUrl } from "@/domain/utils/TKIconUrl";
import TKSubmissionEntryView from "./TKSubmissionEntryView.vue";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import { TKSubmissionEntry } from "@/domain/survey/TKSubmissionEntry";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import TKVisualizerOptionsModule from "@/store/modules/visualizeroptions/TKVisualizerOptionsModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import { TKSubmission } from "@/domain/survey/TKSubmission";
import {
  applyVisualizerOptions,
  getEntriesForThematic
} from "@/domain/survey/TKSubmissionEntries";
import { TKFDFThematicTrafficLightType } from "@/domain/fdf/TKFDFThematicTrafficLights/TKFDFThematicTrafficLightConfiguration";
import { TKFDFTrafficLightColormapItem } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightColormap";

import TKSubmissionThematicTrafficLightComponent from "./TKSubmissionThematicTrafficLightComponent.vue";

@Component({
  components: {
    TKSubmissionEntryView,
    TKSubmissionThematicTrafficLightComponent
  }
})
export default class TKSubmissionThematicView extends Vue {
  @Prop()
  readonly submissionThematic!: TKSubmissionThematic;

  get hideUnanswered() {
    return TKVisualizerOptionsModule.hideUnanswered;
  }

  get searchFilter() {
    return TKVisualizerOptionsModule.searchFilter;
  }

  get sortByTrafficLight() {
    return TKVisualizerOptionsModule.sortByTrafficLight;
  }

  get currentSubmission(): TKSubmission | null {
    return TKDatasetModule.dataset.currentSubmission;
  }

  entries: Array<TKSubmissionEntry> = [];

  title = "";
  iconurl = "";
  @Watch("submissionThematic", { immediate: true })
  onSubmissionThematicchanged() {
    if (this.submissionThematic) {
      this.handleLocaleOnTitle();
      this.iconurl = TKIconUrl(this.submissionThematic.iconFileName);
    } else {
      this.iconurl = "";
    }
    this.updateThematicData();
  }

  @Watch("$root.$i18n.locale")
  handleLocaleOnTitle() {
    if (this.submissionThematic) {
      this.title = TKGetLocalValue(
        this.submissionThematic.nameLabel,
        this.$root.$i18n.locale
      );
    } else {
      this.title = "";
    }
  }

  @Watch("hideUnanswered", { immediate: true })
  @Watch("sortByTrafficLight", { immediate: true })
  @Watch("searchFilter", { immediate: true })
  updateThematicData() {
    this.entries = [];
    if (this.submissionThematic && this.currentSubmission) {
      const entries = getEntriesForThematic(
        this.currentSubmission.entries,
        this.submissionThematic
      );
      this.entries = applyVisualizerOptions(entries);
      this.computeTrafficLightStatus();
    }
  }

  trafficLight?: TKFDFTrafficLightColormapItem = undefined;
  computeTrafficLightStatus() {
    if (this.submissionThematic.trafficLight) {
      const trafficLightInputs: Array<number> = [];
      for (const entry of this.entries) {
        if (
          entry.isAnswered &&
          "trafficLight" in entry &&
          entry.trafficLight != null
        ) {
          trafficLightInputs.push(entry.trafficLight.rank);
        }
      }

      let trafficLightRankValue = 0;
      switch (this.submissionThematic.trafficLight.type) {
        case TKFDFThematicTrafficLightType.MAX:
          trafficLightRankValue = Math.max(...trafficLightInputs);
          break;
        case TKFDFThematicTrafficLightType.MEAN:
          trafficLightRankValue = Math.round(
            trafficLightInputs.length
              ? trafficLightInputs.reduce((a, b) => a + b, 0) /
                  trafficLightInputs.length
              : 0
          );
          break;
        case TKFDFThematicTrafficLightType.MIN:
          trafficLightRankValue = Math.min(...trafficLightInputs);
          break;
      }
      const colormap = this.submissionThematic.trafficLight.properties.colormap;
      this.trafficLight =
        colormap[Object.keys(colormap)[trafficLightRankValue]];
    } else {
      this.trafficLight = undefined;
    }
  }
}
</script>

<style scoped>
.tk-submission-thematic-container {
  border-radius: 4px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  border: 1px solid var(--v-thematicBorder-base);
  box-shadow: 0 2px 0px 0px var(--v-boxShadow-base);
  width: 100%;
  background-color: var(--v-thematicBackground-base);
  overflow: hidden;
}

.tk-submission-thematic-header {
  padding: 0px 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: var(--v-thematicHeader-base);
  border-bottom: 1px solid var(--v-thematicBorder-base);
}

.tk-submission-thematic-title {
  font-size: 16px;
  font-weight: bolder;
  flex-grow: 2;
}

.tk-submission-chart {
  margin-bottom: 13px;
  margin-top: 13px;
}

.tk-submission-icon {
  height: 36px;
  display: block;
}

.tk-submission-thematic-content {
  padding: 10px 30px;
  width: 100%;
  margin-bottom: -1px;
}
</style>
