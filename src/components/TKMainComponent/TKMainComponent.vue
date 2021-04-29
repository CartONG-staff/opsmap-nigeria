<template>
  <div class="tk-maincomponent">
    <div class="tk-maincomponent-decoration">
      <div class="tk-maincomponent-blur"></div>
      <img class="tk-maincomponent-png" src="@/assets/bg-isoline-custom.png" />
    </div>
    <div class="tk-maincomponent-container">
      <div class="tk-main-header">
        <transition name="fade">
          <div key="1" v-if="isHomePage"></div>
          <div key="2" v-else class="tk-camp-header">
            <TKCampSelector :dataset="dataset" />
          </div>
        </transition>
      </div>
      <div class="tk-main-top">
        <div class="tk-main-left">
          <TKTitle :appConfig="appConfig" />
          <transition mode="out-in" name="fade">
            <TKPlaceHolderLeft v-if="!dataset" />
            <div key="32" v-else-if="isHomePage" class="tk-home-left">
              <TKHomeSubtitle />
              <TKHomeCombos :dataset="dataset" />
            </div>
            <div key="33" v-else class="tk-camp-left">
              <TKCampSubtitle :dataset="dataset" />
              <TKCampToolbar
                :submissionsDates="
                  currentSubmissions ? Object.keys(currentSubmissions) : ['']
                "
                :currentSubmission="currentSubmission"
                :dataset="dataset"
                :options="visualizerOptions"
                @date-selection-changed="dateSelected"
              />
              <TKCampInfos :dataset="dataset" />
            </div>
          </transition>
        </div>
        <TKMap
          v-if="geoData"
          class="tk-main-map"
          :appConfig="appConfig"
          :dataset="dataset"
          :geoDataset="geoData"
        />
        <TKPlaceHolderGeneric class="tk-main-map" v-else />
      </div>

      <div>
        <transition mode="out-in" name="fade" appear>
          <div class="tk-main-content-layout" v-if="!dataset">
            <TKPlaceHolderIndicators />
            <TKPlaceHolderGeneric class="tk-main-content-placeholder" />
          </div>
          <div key="52" class="tk-main-content-layout" v-else-if="isHomePage">
            <TKHomeIndicators
              class="tk-home-indicators"
              :appConfig="appConfig"
              :dataset="dataset"
            />
            <TKHomeMoreInfos :appConfig="appConfig" />
          </div>
          <div key="53" class="tk-main-content-layout" v-else>
            <TKCampIndicators
              class="tk-camp-indicators"
              :appConfig="appConfig"
              :submission="currentSubmission"
            />
            <TKSubmissionVisualizer
              :options="visualizerOptions"
              :submission="currentSubmission"
              :dataset="dataset"
            />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TKPlaceHolderLeft from "./TKPlaceHolders/TKPlaceHolderLeft.vue";
import TKPlaceHolderIndicators from "./TKPlaceHolders/TKPlaceHolderIndicators.vue";
import TKPlaceHolderGeneric from "./TKPlaceHolders/TKPlaceHolderGeneric.vue";
import TKTitle from "./TKTitle.vue";
import TKMap from "./TKMap";

import {
  TKHomeCombos,
  TKHomeIndicators,
  TKHomeMoreInfos,
  TKHomeSubtitle
} from "./TKHomeComponents";

import {
  TKCampIndicators,
  TKCampInfos,
  TKCampSelector,
  TKCampToolbar,
  TKCampSubtitle,
  TKSubmissionVisualizer,
  TKSubmissionVisualizerOptions
} from "./TKCampComponents";
import { TKOpsmapConfiguration } from "@/domain";
import { TKSubmission } from "@/domain/survey/TKSubmission";
import { TKDatasetFilterer, TKFilters } from "@/domain/survey/TKFilters";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { headerLogoBus } from "@/components/TKHeaderLogoBus";

const DEFAULT_VISUALIZER_OPTIONS: TKSubmissionVisualizerOptions = {
  hideUnanswered: false
};

@Component({
  components: {
    TKCampIndicators,
    TKCampInfos,
    TKCampSelector,
    TKCampSubtitle,
    TKCampToolbar,
    TKSubmissionVisualizer,
    TKHomeCombos,
    TKHomeIndicators,
    TKHomeMoreInfos,
    TKHomeSubtitle,
    TKMap,
    TKPlaceHolderLeft,
    TKPlaceHolderIndicators,
    TKPlaceHolderGeneric,
    TKTitle
  }
})
export default class TKMainComponent extends Vue {
  @Prop()
  dataset!: TKDatasetFilterer;

  @Prop()
  geoData!: TKGeoDataset;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  currentSubmission: TKSubmission | null = null;
  currentSubmissions: { [date: string]: TKSubmission } | null = null;
  isHomePage = true;
  visualizerOptions: TKSubmissionVisualizerOptions = {
    hideUnanswered: DEFAULT_VISUALIZER_OPTIONS.hideUnanswered
  };

  created() {
    headerLogoBus.$on("switchToHomePage", () => {
      this.dataset.setFiltersValue(TKFilters.CAMP, null);
      this.isHomePage = true;
    });
  }

  dateSelected(date: string) {
    if (
      this.currentSubmissions &&
      Object.keys(this.currentSubmissions).includes(date)
    ) {
      this.currentSubmission = this.currentSubmissions[date];
    }
  }

  @Watch("dataset.currentSurvey")
  onSurveyChange() {
    this.isHomePage = true;
  }

  @Watch("dataset.currentCamp")
  onCampChange() {
    if (this.dataset.currentCamp) {
      this.isHomePage = false;
      this.visualizerOptions.hideUnanswered =
        DEFAULT_VISUALIZER_OPTIONS.hideUnanswered;
      this.currentSubmissions = this.dataset.surveys[
        this.dataset.currentSurvey
      ].submissionsByCamps[this.dataset.currentCamp.id];
      const keys = Object.keys(this.currentSubmissions);
      this.currentSubmission = this.currentSubmissions[keys[0]];
    } else {
      this.currentSubmissions = null;
      this.currentSubmission = null;
      this.visualizerOptions.hideUnanswered =
        DEFAULT_VISUALIZER_OPTIONS.hideUnanswered;
    }
  }
}
</script>

<style scoped>
.tk-maincomponent-decoration {
  position: absolute;
  width: 100%;
  height: 365px;
}

.tk-maincomponent-blur {
  position: absolute;
  width: 100%;
  height: 365px;
  opacity: 0.21;
  background: linear-gradient(#3a9ed3ff, #3a9ed300);
}

.tk-maincomponent-png {
  position: absolute;
  width: 100%;
  height: 365px;
  background-size: 100% 365px;
}

.tk-maincomponent-container {
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
  padding-top: 25px;
  padding-bottom: 25px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
  height: 100%;
}

.tk-main-header {
  display: block;
  height: 50px;
  z-index: 1000;
}

.tk-camp-header {
  align-items: flex-end;
  height: 100%;
  margin-left: -20px;
  margin-right: -20px;
}

.tk-main-top {
  display: flex;
  flex-flow: row nowrap;
  align-items: top;
  width: 100%;
  max-height: 450px;
  justify-content: space-between;
}

.tk-main-left {
  width: 30%;
  padding-bottom: 20px;
  padding-top: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  height: 450px;
}

.tk-home-left {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
  align-items: left;
}

.tk-camp-left {
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: top;
  width: 100%;
  justify-content: space-between;
}

.tk-main-map {
  width: 65%;
  height: 450px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.tk-main-content-layout {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
}

.tk-main-content-placeholder {
  min-height: 300px;
}
</style>
