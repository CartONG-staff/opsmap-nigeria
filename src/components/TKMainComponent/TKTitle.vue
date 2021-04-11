<template>
  <div class="tk-title">
    <span class="tk-title-base">
      {{ $t("main.title") }}
    </span>
    <br />
    <span class="tk-title-country">
      {{ appConfig.name }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/config/TKGeneralConfiguration";

@Component
export default class TKTitle extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style scoped>
.tk-title-base {
  color: var(--v-accent-base);
  font-size: 40px;
}

.tk-title-country {
  color: var(--v-campTitle-base);
  font-size: 40px;
  font-weight: bold;
}
</style>
