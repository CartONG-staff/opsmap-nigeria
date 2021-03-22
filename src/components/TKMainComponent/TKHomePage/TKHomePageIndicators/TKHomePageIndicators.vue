<template>
  <div class="tk-homepage-indicators">
    <p>INDICATOR</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";

@Component({})
export default class TKHomePageIndicators extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-homepage-indicators {
  background-color: yellow;
  height: 400px;
}
</style>
