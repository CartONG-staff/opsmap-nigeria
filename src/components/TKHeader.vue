<template lang="html">
  <div class="tk-header">
    <div>
      <button class="tk-header-logo-opsmap-container" v-on:click="logoClicked">
        <img
          src="@/assets/LogoOpsmap.png"
          alt="Opsmap"
          class="tk-header-logo-cccm"
        />
        <h3>
          <span class="tk-header-title-opsmap">{{
            appConfig.name.toUpperCase()
          }}</span>
        </h3>
      </button>
    </div>
    <div class="tk-header-right">
      <div class="tk-header-logo-cccm-container">
        <a href="https://cccmcluster.org" target="_blank">
          <img
            src="@/assets/LogoCluster.png"
            alt="CCCM"
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
import { TKOpsmapConfiguration } from "@/domain/opsmapConfig/TKOpsmapConfiguration";
import { headerLogoBus } from "@/components/TKHeaderLogoBus";

@Component
export default class TKHeader extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
  locales = this.$root.$i18n.availableLocales;

  language = this.$root.$i18n.locale;
  @Watch("language")
  // whenever question changes, this function will run
  onLanguageChanged(val: string) {
    this.$root.$i18n.locale = val;
  }

  logoClicked() {
    headerLogoBus.$emit("switchToHomePage");
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

.tk-header-logo-opsmap-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
}

.tk-header-title-opsmap {
  color: var(--v-accent-base);
  letter-spacing: 1.5;
  font-weight: 700;
  font-size: 18px;
}

.tk-header-logo-cccm-container {
  display: block;
  height: 52px;
  width: 172px;
  border-radius: 8px;
  outline: hidden;
}

.tk-header-logo-cccm {
  height: 52px;
}

.tk-header-right {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 10px;
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

button:active {
  outline: 0;
}

button:focus {
  outline: 0;
}
</style>
