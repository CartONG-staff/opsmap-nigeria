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
              :campList="campsList"
              :survey="currentSubmissions"
            />
            <TKCampInfos class="tk-camp-infos" :camp="currentCamp" />
          </div>
        </div>
        <TKMap
          class="tk-main-map"
          :appConfig="appConfig"
          :campList="campsList"
          :currentCampId="currentCamp.id"
          @camp-selection-cleared="campSelectionCleared"
          @camp-selection-changed="campSelectionChanged"
        />
      </div>

      <div class="tk-main-content">
        <div v-if="isHomePage" class="tk-home-content">
          <TKHomeIndicators class="tk-home-indicators" :appConfig="appConfig" />
          <TKHomeMoreInfos />
        </div>
        <div v-if="!isHomePage" class="tk-camp-content">
          <TKCampIndicators class="tk-camp-indicators" :appConfig="appConfig" />
          <TKSurveyVisualizer :survey="currentSubmissions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/config/TKGeneralConfiguration";
import { TKDatasetBuild } from "@/domain/data/survey/TKDatasetBuilder";

import TKTitle from "./TKTitle.vue";
import TKMap from "./TKMap";

import { TKCampDescription } from "@/domain/core/TKCampDescription";
import { TKDataset } from "@/domain/core/TKDataset";
import { TKSubmissions } from "@/domain/core/TKSubmissions";

import {
  TKHomeCombos,
  TKHomeIndicators,
  TKHomeMoreInfos,
  TKHomeSubtitle,
} from "./TKHomeComponents";

import {
  TKCampIndicators,
  TKCampInfos,
  TKCampSelector,
  TKCampToolbar,
  TKCampSubtitle,
  TKSurveyVisualizer,
} from "./TKCampComponents";

const DEFAULT_CAMP_DESCRIPTION: TKCampDescription = {
  id: "",
  name: "",
  type: "",
  submissionsDates: [""],
  coordinates: [0, 0],
};

@Component({
  components: {
    TKCampIndicators,
    TKCampInfos,
    TKCampSelector,
    TKCampSubtitle,
    TKCampToolbar,
    TKSurveyVisualizer,
    TKHomeCombos,
    TKHomeIndicators,
    TKHomeMoreInfos,
    TKHomeSubtitle,
    TKMap,
    TKTitle,
  },
})
export default class TKMainComponent extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;

  dataset!: TKDataset;
  campsList: TKCampDescription[] = [];

  currentCamp: TKCampDescription = DEFAULT_CAMP_DESCRIPTION;
  currentSubmissions: TKSubmissions = {};
  isHomePage = true;

  campSelectionCleared() {
    this.currentCamp = DEFAULT_CAMP_DESCRIPTION;
    this.currentSubmissions = {};
    this.isHomePage = true;
  }
  campSelectionChanged(campId: string) {
    this.isHomePage = false;
    const found = this.campsList.find((element) => element.id === campId);
    if (found) {
      this.currentCamp = found;
      this.currentSubmissions = this.dataset.submissionsByCamps[campId];
    } else {
      this.currentCamp = DEFAULT_CAMP_DESCRIPTION;
    }
  }

  async mounted() {
    const datasets = await TKDatasetBuild(
      this.appConfig.surveyDescription,
      this.appConfig.surveyFormat,
      this.appConfig.spatialDescription,
      this.appConfig.language
    );
    console.log(datasets);

    // TODO : make this nice. This isn't
    this.dataset = datasets["2021"];
    this.campsList = this.dataset.campsList;
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
