<template lang="html">
  <div class="tk-header">
    <h3>
      <span class="tk-header-title-base">{{ $t("title").toUpperCase() }} </span>
      <span class="tk-header-title-opsmap">{{
        appConfig.name.toUpperCase()
      }}</span>
    </h3>
    <div class="tk-header-right">
      <div class="tk-header-logo-cccm-container">
        <a :href="cccmLogo.urlRedirection" target="_blank">
          <img
            :src="cccmLogo.urlLogo"
            :alt="cccmLogo.name"
            class="tk-header-logo-cccm"
          />
        </a>
      </div>

      <v-btn-toggle
        v-model="language"
        mandatory
        group
        dense
        class="tk-header-buttons"
        color="accent"
      >
        <div
          v-for="(locale, key) in locales"
          :key="locale"
          class="tk-buttons-container"
        >
          <div v-if="key > 0" class="tk-header-buttons-sep"></div>
          <v-btn plain text :value="locale">{{ locale.toUpperCase() }}</v-btn>
        </div>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import {
  TKOpsmapConfiguration,
  HEADER_CCCM_LOGO
} from "@/domain/opsmapConfig/TKOpsmapConfiguration";
import { TKLogo } from "@/domain/ui/TKLogo";

@Component
export default class TKHeader extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  cccmLogo: TKLogo = HEADER_CCCM_LOGO;
  locales = this.$root.$i18n.availableLocales;

  language = this.$root.$i18n.locale;
  @Watch("language")
  // whenever question changes, this function will run
  onLanguageChanged(val: string) {
    this.$root.$i18n.locale = val;
  }
}
</script>

<style>
.tk-header-buttons .v-btn--active > .v-btn__content {
  color: var(--v-accent-base) !important;
}
</style>

<style scoped>
.tk-header {
  background-color: var(--v-background-base);
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}

.tk-header-logo-cccm-container {
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;

  height: 52px;
  width: 172px;
  border-radius: 8px;
  background-color: #f1f3f3;
}

.tk-header-logo-cccm {
  display: block;
  height: 37px;
}

.tk-header-right {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 10px;
}

.tk-header-title > h3 {
  text-align: center;
}

h3 .tk-header-title-base {
  color: var(--v-primary-base);
}

.tk-header-title-opsmap {
  color: var(--v-accent-base);
}

.tk-buttons-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.tk-header-buttons {
  flex-basis: 30%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 0px;
  color: #919191;
  font-size: 13px;
  font-weight: bold;
}

.tk-header-buttons-sep {
  height: 10px;
  width: 2px;
  background-color: #7d7d7d;
}
</style>
