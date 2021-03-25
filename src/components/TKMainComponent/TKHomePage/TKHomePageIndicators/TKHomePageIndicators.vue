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
    TKHomePageIndicator,
  },
})
export default class TKHomePageIndicators extends Vue {
  indicator1: TKHomeIndicator = {
    value: 52,
    name: "SITES",
  };

  indicator2: TKHomeIndicator = {
    value: 1515,
    name: "Marignan",
  };

  indicator3: TKHomeIndicator = {
    value: 1848,
    name: "Abolition de l'esclavage",
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
