<template>
  <div class="tk-home-title">
    <span class="tk-home-title-base">
      {{ $t("home.title") }}
    </span>
    <br />
    <span class="tk-home-title-country">
      {{ appConfig.name }}
    </span>
    <br />
    <span class="tk-home-title-last-update">
      {{ $t("home.lastUpdate") }}: 14/02/2002
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";

@Component
export default class TKHomeTitle extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-home-title-base {
  color: var(--v-accent-base);
  font-size: 40px;
}

.tk-home-title-country {
  color: var(--v-homeTitle-base);
  font-size: 40px;
  font-weight: bold;
}

.tk-home-title-last-update {
  color: var(--v-secondary-base);
  font-size: 11px;
}
</style>
