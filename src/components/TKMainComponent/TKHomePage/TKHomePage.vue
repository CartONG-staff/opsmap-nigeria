<template>
  <div class="tk-homepage">
    <TKHomePageTitle class="tk-homepage-title" />
    <TKMap class="tk-homepage-map" :config="appConfig.mapConfig" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";
import TKMap from "@/components/TKMainComponent/TKMap";
import TKHomePageTitle from "./TKHomePageTitle.vue";

@Component({
  components: { TKMap, TKHomePageTitle },
})
export default class TKHomePage extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-homepage {
  display: flex;
  flex-grow: column nowrap;
  justify-content: space-between;
  align-items: top;
  column-gap: 50px;
}

.tk-homepage-title {
  flex-basis: 33%;
}

.tk-homepage-map {
  flex-basis: 64%;
}
</style>
