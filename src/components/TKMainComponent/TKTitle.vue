<template>
  <div class="tk-title">
    <span class="tk-title-base">
      {{ $t("main.title") }}
    </span>
    <br />
    <span class="tk-title-country">
      {{
        appConfig.name.charAt(0).toUpperCase() +
          appConfig.name.slice(1).toLowerCase()
      }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKOpsmapConfiguration } from "@/domain/opsmapConfig/TKOpsmapConfiguration";

@Component
export default class TKTitle extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
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
