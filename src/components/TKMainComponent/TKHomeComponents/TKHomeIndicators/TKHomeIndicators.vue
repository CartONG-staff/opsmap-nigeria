<template>
  <div class="tk-home-indicators">
    <TKHomeIndicator :indicator="this.indicator1" />
    <TKHomeIndicator :indicator="this.indicator2" />
    <TKHomeIndicator :indicator="this.indicator3" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";
import TKHomeIndicator from "./TKHomeIndicator.vue";
import { TKIndicator } from "@/domain/UI/TKIndicator";
@Component({
  components: {
    TKHomeIndicator
  }
})
export default class TKHomeIndicators extends Vue {
  indicator1: TKIndicator = {
    value: 57,
    name: "Sites",
    icon:
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/IDP-refugee-camp.png"
  };

  indicator2: TKIndicator = {
    value: 520,
    name: "People",
    icon:
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/People-in-need.png"
  };

  indicator3: TKIndicator = {
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
