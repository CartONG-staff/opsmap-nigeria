<template lang="html">
  <div class="tk-header">
    <div class="tk-header-logos">
      <div
        v-for="items in appConfig.headerLogo"
        :key="items.urlLogo"
        class="tk-header-logos-item"
      >
        <a :href="items.urlRedirection" target="_blank">
          <img
            :src="items.urlLogo"
            :alt="items.name"
            class="tk-header-logos-item-logo"
          />
        </a>
      </div>
    </div>
    <div class="tk-header-title">
      <h3>
        <span class="tk-header-title-base"
          >{{ $t("opsmapTitle").toUpperCase() }}
          {{ $t("opsmapSubtitle").toUpperCase() }}
        </span>
        <span class="tk-header-title-opsmap">{{ appConfig.name }}</span>
      </h3>
    </div>

    <div class="tk-header-buttons">
      <v-btn-toggle v-model="language" mandatory group>
        <v-btn
          v-for="item in appConfig.language"
          :key="item.code"
          :value="item.code"
        >
          <img :src="item.flag" :alt="item.name" />
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";

@Component
export default class TKHeader extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;

  language = "en";
  @Watch("language")
  // whenever question changes, this function will run
  onLanguageChanged(val: string) {
    this.$root.$i18n.locale = val;
  }
}
</script>

<style scoped>
.tk-header {
  background-color: var(--v-background-base);
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  vertical-align: middle;
  height: 70px;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}

.tk-header-logos {
  display: flex;
  flex-flow: row wrap;
  column-gap: 5px;
  flex-basis: 30%;
  justify-content: left;
  align-items: center;
}

.tk-header-logos-item-logo {
  height: 50px;
}

.tk-header-title {
  margin-top: auto;
  margin-bottom: auto;
  flex-basis: 40%;
}
.tk-header-title > h3 {
  text-align: center;
}

h3 .tk-header-title-base {
  color: var(--v-tertiary-base);
}

.tk-header-title-opsmap {
  color: var(--v-secondary-base);
}

.tk-header-buttons {
  flex-basis: 30%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 10px;
}
</style>
