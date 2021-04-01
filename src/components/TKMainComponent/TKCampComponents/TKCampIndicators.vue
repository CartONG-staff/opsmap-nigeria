<template>
  <div class="tk-camp-indicators">
    <TKIndicatorComponent :indicator="this.indicator1" />
    <TKIndicatorComponent :indicator="this.indicator2" />
    <TKIndicatorComponent :indicator="this.indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";
import TKIndicatorComponent from "../TKIndicator.vue";
import { TKIndicator } from "@/domain/UI/TKIndicator";
@Component({
  components: {
    TKIndicatorComponent
  }
})
export default class TKCampIndicators extends Vue {
  indicator1: TKIndicator = {
    value: 20,
    name: "Sites",
    icon:
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/IDP-refugee-camp.png"
  };

  indicator2: TKIndicator = {
    value: 100,
    name: "People",
    icon:
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/People-in-need.png"
  };

  indicator3: TKIndicator = {
    value: 0,
    name: "Overcrowded",
    icon:
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/Permanent-camp.png"
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
