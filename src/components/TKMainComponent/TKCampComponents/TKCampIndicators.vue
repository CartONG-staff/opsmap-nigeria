<template>
  <div class="tk-camp-indicators">
    <TKIndicatorComponent :backgroundType="1" :indicator="this.indicator1" />
    <TKIndicatorComponent :backgroundType="2" :indicator="this.indicator2" />
    <TKIndicatorComponent :backgroundType="3" :indicator="this.indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/config/TKGeneralConfiguration";
import TKIndicatorComponent from "../TKIndicator.vue";
import { TKIndicator } from "@/domain/ui/TKIndicator";
@Component({
  components: {
    TKIndicatorComponent,
  },
})
export default class TKCampIndicators extends Vue {
  indicator1: TKIndicator = {
    value: 20,
    name: "Sites",
    iconOchaName: "IDP-refugee-camp",
  };

  indicator2: TKIndicator = {
    value: 100,
    name: "People",
    iconOchaName: "People-in-need",
  };

  indicator3: TKIndicator = {
    value: 0,
    name: "Overcrowded",
    iconOchaName: "Permanent-camp",
  };

  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-camp-indicators {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
}

.tk-camp-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
