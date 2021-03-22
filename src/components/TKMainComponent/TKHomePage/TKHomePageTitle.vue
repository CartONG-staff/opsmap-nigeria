<template>
  <div class="tk-homepage-title">
    <span class="tk-homepage-title-base">
      {{ $t("opsmapTitle") }}
    </span>
    <br />
    <span class="tk-homepage-title-base">
      {{ $t("opsmapSubtitle") }}
    </span>
    <br />
    <span class="tk-homepage-title-country">
      {{ appConfig.name }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";

@Component
export default class TKHomePageTitle extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-homepage-title-base {
  color: var(--v-secondary-base);
  font-size: 30px;
}

.tk-homepage-title-country {
  color: var(--v-homeTitle-base);
  font-size: 30px;
  font-weight: bold;
}
</style>
