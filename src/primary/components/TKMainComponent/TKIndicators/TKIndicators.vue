<template>
  <div class="tk-indicators" v-if="indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="indicators[0]" />
    <TKIndicatorComponent :backgroundType="2" :indicator="indicators[1]" />
    <TKIndicatorComponent :backgroundType="3" :indicator="indicators[2]" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TKIndicatorComponent from "./TKIndicator.vue";
import { TKIndicators } from "@/domain/survey/TKIndicator";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";

@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKSiteIndicators extends Vue {
  get dataset() {
    return TKDatasetModule.dataset;
  }
  get indicators(): TKIndicators | null {
    if (this.dataset.currentSubmission) {
      return this.dataset.currentSubmission.indicators;
    }
    return this.dataset.currentAreaIndicators;
  }
}
</script>

<style scoped>
.tk-indicators {
  display: flex;
  flex-flow: row wrap;
  justify-content: left;
  align-items: top;
  column-gap: 5%;
  row-gap: 10px;
}

.tk-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
