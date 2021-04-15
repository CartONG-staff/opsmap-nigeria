<template>
  <div class="tk-home-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="this.indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="this.indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="this.indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/core/TKGeneralConfiguration";
import TKIndicatorComponent from "../TKIndicator.vue";
@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKHomeIndicators extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;

  readonly indicator1 = this.appConfig.indicatorsDescription.site[0];
  readonly indicator2 = this.appConfig.indicatorsDescription.site[1];
  readonly indicator3 = this.appConfig.indicatorsDescription.site[2];
}
</script>

<style scoped>
.tk-home-indicators {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
}

.tk-home-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
