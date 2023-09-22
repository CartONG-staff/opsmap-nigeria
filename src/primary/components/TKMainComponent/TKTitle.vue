<template>
  <transition mode="out-in" name="fade-in">
    <div :key="$root.$i18n.locale" class="tk-title">
      <span class="tk-title-base">
        {{ $t("title") }}
      </span>

      <br />
      <span class="tk-title-country">
        {{ appName.toUpperCase() }}
      </span>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { toTitleCase } from "@/domain/utils/TKStringUtils";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

@Component
export default class TKTitle extends Vue {
  appName = toTitleCase(
    TKGetLocalValue(
      TKConfigurationModule.configuration.textContent.name,
      this.$root.$i18n.locale
    )
  );

  @Watch("$root.$i18n.locale")
  handeLocale() {
    this.appName = toTitleCase(
      TKGetLocalValue(
        TKConfigurationModule.configuration.textContent.name,
        this.$root.$i18n.locale
      )
    );
  }
}
</script>

<style scoped>
.tk-title-base {
  color: var(--v-accent-base);
  font-size: 40px;
  font-variant: small-caps;
}

.tk-title-country {
  color: var(--v-autocomplete-base);
  font-size: 40px;
  font-weight: bold;
  font-variant: small-caps;
}
</style>
