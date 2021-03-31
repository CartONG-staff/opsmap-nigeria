<template>
  <div class="tk-maincomponent">
    <v-btn :ripple="false" v-on:click="switchPage()">{{
      $t("main.switchPage")
    }}</v-btn>

    <div class="tk-main-top">
      <div class="tk-main-header"></div>

      <div class="tk-main-left">
        <div v-if="isHomePage" class="tk-home-left">
          <TKHomeTitle class="tk-home-title" :appConfig="appConfig" />
          <TKHomeCombos class="tk-home-combos" :appConfig="appConfig" />
        </div>
        <div v-if="!isHomePage" class="tk-camp-left"></div>
      </div>
      <tk-map class="tk-main-map" :config="appConfig.mapConfig" />
    </div>

    <div class="tk-main-content">
      <div v-if="isHomePage" class="tk-home-content">
        <TKHomeIndicators class="tk-home-indicators" :appConfig="appConfig" />
        <TKHomeMoreInfos />
      </div>
      <div v-if="!isHomePage" class="tk-camp-content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";

import {
  TKHomeTitle,
  TKHomeCombos,
  TKHomeIndicators,
  TKHomeMoreInfos,
} from "./TKHomeComponents";

@Component({
  components: {
    TKHomeTitle,
    TKHomeCombos,
    TKHomeIndicators,
    TKHomeMoreInfos,
  },
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
.tk-maincomponent {
  background-color: whitesmoke;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
}

.tk-main-top {
  display: flex;
  flex-flow: row nowrap;
  align-items: top;
  width: 100%;
  justify-content: space-between;
}

.tk-main-left {
  width: 35%;
  padding-right: 10%;
}

.tk-home-left {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
  align-items: left;
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
</style>
