<template>
  <div class="tk-homepage-indicators">
    <TKHomePageIndicator />
    <TKHomePageIndicator />
    <TKHomePageIndicator />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";
import TKHomePageIndicator from "./TKHomePageIndicator.vue";

@Component({
  components: {
    TKHomePageIndicator,
  },
})
export default class TKHomePageIndicators extends Vue {
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
