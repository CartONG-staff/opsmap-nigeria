<template>
  <div class="tk-homepage">
    <div class="tk-homepage-top">
      <div class="tk-homepage-left">
        <TKHomePageTitle class="tk-homepage-title" :appConfig="appConfig" />
        <TKHomePageCombos class="tk-homepage-combos" :appConfig="appConfig" />
      </div>
      <TKMap class="tk-homepage-map" :config="appConfig.mapConfig" />
    </div>
    <TKHomePageIndicators
      class="tk-homepage-indicators"
      :appConfig="appConfig"
    />
    <TKHomePageMoreInfos />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";
import TKMap from "@/components/TKMainComponent/TKMap";
import TKHomePageTitle from "./TKHomePageTitle.vue";
import TKHomePageCombos from "./TKHomePageCombos";
import TKHomePageIndicators from "./TKHomePageIndicators";
import TKHomePageMoreInfos from "./TKHomePageMoreInfos.vue";

@Component({
  components: {
    TKMap,
    TKHomePageTitle,
    TKHomePageCombos,
    TKHomePageIndicators,
    TKHomePageMoreInfos,
  },
})
export default class TKHomePage extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-homepage {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  row-gap: 50px;
}

.tk-homepage-top {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 100%;
}

.tk-homepage-left {
  width: 25%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: left;
}
.tk-homepage-map {
  width: 65%;
}

.tk-homepage-indicators {
  width: 100%;
}
</style>
