<template>
  <div class="tk-maincomponent">
    <div class="tk-maincomponent-decoration">
      <div class="tk-maincomponent-blur"></div>
      <img class="tk-maincomponent-png" src="@/assets/bg-isoline-custom.png" />
    </div>
    <div class="tk-maincomponent-container">
      <div class="tk-main-header">
        <div v-if="isHomePage" class="tk-home-header"></div>
        <div v-if="!isHomePage" class="tk-camp-header">
          <TKCampSelector
            :campList="campsList"
            :currentCamp="currentCamp"
            @camp-selection-cleared="campSelectionCleared"
            @camp-selection-changed="campSelectionChanged"
          />
        </div>
      </div>
      <div class="tk-main-top">
        <div class="tk-main-left">
          <TKTitle class="tk-home-title" :appConfig="appConfig" />
          <div v-if="isHomePage" class="tk-home-left">
            <TKHomeSubtitle />
            <TKHomeCombos
              class="tk-home-combos"
              :appConfig="appConfig"
              :campList="campsList"
              :currentCamp="currentCamp"
              @camp-selection-cleared="campSelectionCleared"
              @camp-selection-changed="campSelectionChanged"
            />
          </div>
          <div v-if="!isHomePage" class="tk-camp-left">
            <TKCampSubtitle class="tk-camp-title" :camp="currentCamp" />
            <TKCampToolbar
              class="tk-camp-toolbar"
              :submissionsDates="
                currentSubmissions ? Object.keys(currentSubmissions) : ['']
              "
              :options="visualizerOptions"
              @date-selection-changed="dateSelected"
            />
            <TKCampInfos class="tk-camp-infos" :camp="currentCamp" />
          </div>
        </div>
        <TKMap
          class="tk-main-map"
          :appConfig="appConfig"
          :campList="campsList"
          :currentCamp="currentCamp"
          @camp-selection-cleared="campSelectionCleared"
          @camp-selection-changed="campSelectionChanged"
        />
      </div>

      <div class="tk-main-content">
        <div v-if="isHomePage" class="tk-home-content">
          <TKHomeIndicators
            class="tk-home-indicators"
            :appConfig="appConfig"
            :survey="survey"
          />
          <TKHomeMoreInfos />
        </div>
        <div v-if="!isHomePage" class="tk-camp-content">
          <TKCampIndicators
            class="tk-camp-indicators"
            :appConfig="appConfig"
            :submission="currentSubmission"
          />
          <TKSubmissionVisualizer
            :options="visualizerOptions"
            :submission="currentSubmission"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";
import { TKCreateSurveyCollection } from "@/domain/survey/TKCreateSurveyCollection";

import TKTitle from "./TKTitle.vue";
import TKMap from "./TKMap";

import { TKCampDescription } from "@/domain/core/TKCampDescription";
import { TKSurvey } from "@/domain/core/TKSurvey";
import { TKSubmission } from "@/domain/core/TKSubmission";

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
  readonly appConfig!: TKGeneralConfiguration;

  survey: TKSurvey | null = null;
  campsList: TKCampDescription[] = [];

  currentCamp: TKCampDescription | null = null;
  currentSubmission: TKSubmission | null = null;
  currentSubmissions: { [date: string]: TKSubmission } | null = null;

  isHomePage = true;

  visualizerOptions: TKSubmissionVisualizerOptions = {
    hideUnanswered: DEFAULT_VISUALIZER_OPTIONS.hideUnanswered
  };

  campSelectionCleared() {
    this.currentCamp = null;
    this.currentSubmission = null;
    this.isHomePage = true;
    this.visualizerOptions.hideUnanswered =
      DEFAULT_VISUALIZER_OPTIONS.hideUnanswered;
  }

  campSelectionChanged(campDescr: TKCampDescription) {
    this.isHomePage = false;
    this.visualizerOptions.hideUnanswered =
      DEFAULT_VISUALIZER_OPTIONS.hideUnanswered;

    if (campDescr && this.survey) {
      this.currentCamp = campDescr;
      this.currentSubmissions = this.survey.submissionsByCamps[campDescr.id];
      const keys = Object.keys(this.currentSubmissions);
      this.currentSubmission = this.currentSubmissions[keys[0]];
    } else {
      this.currentSubmissions = null;
      this.currentSubmission = null;
      this.currentCamp = null;
    }
  }

  dateSelected(date: string) {
    if (
      this.currentSubmissions &&
      Object.keys(this.currentSubmissions).includes(date)
    ) {
      this.currentSubmission = this.currentSubmissions[date];
    }
  }

  async mounted() {
    const surveys = await TKCreateSurveyCollection(
      this.appConfig.surveyDescription,
      this.appConfig.surveyFormat,
      this.appConfig.spatialDescription,
      this.appConfig.indicatorsDescription,
      this.appConfig.language
    );

    console.log(surveys);

    // TODO : make this nice. This isn't
    this.survey = surveys["2021"];
    this.campsList = this.survey.campsList;
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
}

.tk-home-content {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
}

.tk-camp-infos {
  flex-grow: 1;
}

.tk-camp-content {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
}
</style>
