<template>
  <div class="tk-homepage-combos">
    <p>ZOOM ON THE MAP</p>
    <p>COMBO 1</p>
    <p>COMBO 2</p>
    <p>COMBO 3</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";

@Component({})
export default class TKHomePageCombos extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-homepage-combos {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: middle;
}
</style>
