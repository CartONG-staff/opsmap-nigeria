<template>
  <div class="tk-homepage-indicators">
    <TKHomePageIndicator :indicator="this.indicator1" />
    <TKHomePageIndicator :indicator="this.indicator2" />
    <TKHomePageIndicator :indicator="this.indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";
import TKHomePageIndicator from "./TKHomePageIndicator.vue";
import { TKHomeIndicator } from "@/domain/UI/TKHomeIndicator";
@Component({
  components: {
    TKHomePageIndicator
  }
})
export default class TKHomePageIndicators extends Vue {
  indicator1: TKHomeIndicator = {
    value: 57,
    name: "Sites",
    icon:
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/IDP-refugee-camp.png"
  };

  indicator2: TKHomeIndicator = {
    value: 520,
    name: "People",
    icon:
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/People-in-need.png"
  };

  indicator3: TKHomeIndicator = {
    value: 20,
    name: "Sites overcrowded",
    icon:
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/Permanent-camp.png"
  };

  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-homepage-indicators {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
}

.tk-homepage-indicators > * {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 30%;
  border-radius: 15px;
}
</style>
