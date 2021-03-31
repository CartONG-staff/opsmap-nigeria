<template>
  <div class="tk-camppage">
    <div class="tk-camppage-top">
      <div class="tk-camppage-left">
        <div class="tk-camppage-title" />
        <div class="tk-camppage-combos" />
      </div>
      <tk-map class="tk-camppage-map" :config="appConfig.mapConfig" />
    </div>
    <div class="tk-camppage-indicators" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";

@Component
export default class TKCampPage extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-camppage {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  row-gap: 25px;
}

.tk-camppage-top {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  width: 100%;
  margin-top: 100px;
}

.tk-camppage-left {
  width: 25%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
  align-items: left;
}
.tk-camppage-map {
  width: 65%;
}

.tk-camppage-indicators {
  width: 100%;
}
</style>
