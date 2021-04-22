<template>
  <div class="tk-maincomponent">
    <div class="tk-maincomponent-decoration">
      <div class="tk-maincomponent-blur"></div>
      <img class="tk-maincomponent-png" src="@/assets/bg-isoline-custom.png" />
    </div>
    <div class="tk-maincomponent-container">
      <div class="tk-main-header">
        <transition name="fade">
          <div key="1" v-if="isHomePage" class="tk-home-header"></div>
          <div key="2" v-else class="tk-camp-header">
            <TKCampSelector :dataset="dataset" />
          </div>
        </transition>
      </div>
      <div class="tk-main-top">
        <div class="tk-main-left">
          <TKTitle class="tk-home-title" :appConfig="appConfig" />
          <transition mode="out-in" name="fade">
            <div key="3" v-if="isHomePage" class="tk-home-left">
              <TKHomeSubtitle />
              <TKHomeCombos class="tk-home-combos" :dataset="dataset" />
            </div>
            <div key="4" v-else class="tk-camp-left">
              <TKCampSubtitle class="tk-camp-title" :dataset="dataset" />
              <TKCampToolbar
                class="tk-camp-toolbar"
                :submissionsDates="
                  currentSubmissions ? Object.keys(currentSubmissions) : ['']
                "
                :options="visualizerOptions"
                @date-selection-changed="dateSelected"
              />
              <TKCampInfos class="tk-camp-infos" :dataset="dataset" />
            </div>
          </transition>
        </div>
        <TKMap
          class="tk-main-map"
          :appConfig="appConfig"
          :dataset="dataset"
          :geoDataset="geoData"
        />
      </div>

      <div class="tk-main-content">
        <transition mode="out-in" name="fade" appear>
          <div key="5" v-if="isHomePage" class="tk-home-content">
            <TKHomeIndicators
              class="tk-home-indicators"
              :appConfig="appConfig"
              :dataset="dataset"
            />
          </div>
          <div key="6" v-else class="tk-camp-content">
            <TKCampIndicators
              class="tk-camp-indicators"
              :appConfig="appConfig"
              :submission="currentSubmission"
            />
          </div>
        </transition>
        <transition mode="out-in" name="fade" appear>
          <div key="7" v-if="isHomePage" class="tk-home-content">
            <TKHomeMoreInfos :appConfig="appConfig" />
          </div>
          <div key="8" v-else class="tk-camp-content">
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
// import { APPCONFIG } from "@/app-demo/config";

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
import { TKDatasetFilterer } from "@/domain/survey/TKFilters";
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

  @Watch("dataset", { deep: true })
  onChange() {
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
}

.tk-main-content {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
}
</style>
