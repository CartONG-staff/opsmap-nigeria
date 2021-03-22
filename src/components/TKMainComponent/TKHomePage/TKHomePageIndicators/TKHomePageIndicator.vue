<template>
  <div class="tk-homepage-indicator">
    <p>
      INDICATOR 1
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";

@Component({})
export default class TKHomePageIndicator extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-homepage-indicator {
  background-color: white;
  border-color: transparent;
  border-radius: 5px;
  height: 200px;
  /* box-shadow: 0 0 3px var(--v-homeTitle-base); */
}
</style>
