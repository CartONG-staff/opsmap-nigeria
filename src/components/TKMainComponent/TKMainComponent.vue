<template>
  <div class="tk-maincomponent">
    <div class="tk-maincomponent-decoration">
      <div class="tk-maincomponent-blur"></div>
      <img class="tk-maincomponent-png" src="@/assets/bg-isoline-custom.png" />
    </div>
    <div class="tk-maincomponent-container">
      <div class="tk-main-header">
        <transition name="fade">
          <router-view name="header"></router-view>
          <!-- <TKCampSelector key="2" v-else :dataset="dataset" /> -->
          -->
        </transition>
      </div>
      <div class="tk-main-top">
        <div class="tk-main-left">
          <TKTitle :appConfig="appConfig" />
          <transition mode="out-in" name="fade">
            <TKPlaceHolderLeft v-if="!dataset" />
            <div key="32" v-else-if="isHomePage" class="tk-home-left">
              <TKHomeSubtitle :dataset="dataset" />
              <TKHomeCombos :dataset="dataset" />
            </div>
            <div key="33" v-else class="tk-camp-left">
              <TKCampSubtitle :dataset="dataset" />
              <TKCampToolbar :dataset="dataset" :options="visualizerOptions" />
              <TKCampInfos
                :dataset="dataset"
                :submission="dataset.currentSubmission"
              />
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

      <div class="tk-main-content-layout">
        <transition mode="out-in" name="fade">
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
          <div key="53" v-else>
            <TKCampIndicators
              class="tk-camp-indicators"
              :appConfig="appConfig"
              :dataset="dataset"
            />
          </div>
        </transition>
        <transition mode="out-in" name="fade" appear>
          <div key="7" v-if="isHomePage && appConfig.iframe">
            <TKIFrame :url="appConfig.iframe" />
          </div>
          <div key="8" v-else class="tk-camp-content">
            <TKSubmissionVisualizer
              :options="visualizerOptions"
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
import TKIFrame from "@/components/TKExtras/TKIFrame.vue";

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
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
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
    TKIFrame,
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

  isHomePage = true;
  visualizerOptions: TKSubmissionVisualizerOptions = {
    hideUnanswered: DEFAULT_VISUALIZER_OPTIONS.hideUnanswered
  };

  created() {
    headerLogoBus.$on("switchToHomePage", () => {
      this.dataset.resetActiveSurvey();
      this.isHomePage = true;
    });
  }

  @Watch("dataset.currentCamp")
  onCampChange() {
    if (this.dataset.currentCamp) {
      if (this.$route.path !== "/site") {
        this.$router.push("site");
      }

      this.isHomePage = false;
      this.visualizerOptions.hideUnanswered =
        DEFAULT_VISUALIZER_OPTIONS.hideUnanswered;
    } else {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
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
  min-width: 1732px;
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
  min-height: 60px;
  z-index: 1000;
  align-items: flex-end;
  height: 100%;
  margin-left: -20px;
  margin-right: -20px;
}

.tk-main-top {
  display: flex;
  flex-flow: row wrap;
  align-items: top;
  width: 100%;
  justify-content: space-between;
  row-gap: 10px;
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
  min-width: 300px;
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
  min-width: 300px;

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

.tk-home-more-content {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
}
</style>
