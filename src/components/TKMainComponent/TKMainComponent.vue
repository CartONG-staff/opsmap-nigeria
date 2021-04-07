<template>
  <div class="tk-maincomponent">
    <img class="tk-maincomponent-png" src="@/assets/bg-isoline-custom.png">
      <div class="tk-maincomponent-blur" />
    </img>
    <div class="tk-maincomponent-container">
      <div class="tk-main-header">
        <div v-if="isHomePage" class="tk-home-header"></div>
        <div v-if="!isHomePage" class="tk-camp-header"><TKCampSelector /></div>
      </div>
      <div class="tk-main-top">
        <div class="tk-main-left">
          <TKTitle class="tk-home-title" :appConfig="appConfig" />
          <div v-if="isHomePage" class="tk-home-left">
            <TKHomeSubtitle />
            <TKHomeCombos class="tk-home-combos" :appConfig="appConfig" />
          </div>
          <div v-if="!isHomePage" class="tk-camp-left">
            <TKCampSubtitle class="tk-camp-title" />
            <TKCampToolbar class="tk-camp-toolbar" />
            <TKCampInfos class="tk-camp-infos" />
          </div>
        </div>
        <v-btn v-on:click="switchPage">{{ $t("main.switchPage") }}</v-btn>
        <TKMap class="tk-main-map" :config="appConfig.mapConfig" />
      </div>

      <div class="tk-main-content">
        <div v-if="isHomePage" class="tk-home-content">
          <TKHomeIndicators class="tk-home-indicators" :appConfig="appConfig" />
          <TKHomeMoreInfos />
        </div>
        <div v-if="!isHomePage" class="tk-camp-content">
          <TKCampIndicators class="tk-camp-indicators" :appConfig="appConfig" />
          <TKSurveyVisualizer />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";
import TKTitle from "./TKTitle.vue";
import TKMap from "@/components/TKMainComponent/TKMap";

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
  TKSurveyVisualizer
} from "./TKCampComponents";

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
    TKTitle
  }
})
export default class TKMainComponent extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;

  isHomePage = true;
  switchPage() {
    this.isHomePage = !this.isHomePage;
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

/* .tk-maincomponent-svg {
  position: absolute;
  width: 100%;
  height: 365px;
  background-color: coral;

  background-size: 150%;
  padding: 0px;
} */

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
  height: 50px;
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
