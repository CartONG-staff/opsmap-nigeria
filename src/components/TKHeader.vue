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
        <span class="tk-header-title-base">CCCM SITE TRACKER </span>
        <span class="tk-header-title-opsmap">{{ appConfig.name }}</span>
      </h3>
    </div>

    <div class="tk-header-spacer"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { GeneralConfiguration } from "@/domain/TKGeneralConfiguration";

@Component
export default class TKHeader extends Vue {
  @Prop()
  readonly appConfig!: GeneralConfiguration;
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
  width: 30%;
  justify-content: left;
  align-items: center;
}

.tk-header-logos-item-logo {
  height: 50px;
}

.tk-header-title {
  margin-top: auto;
  margin-bottom: auto;
  width: 40%;
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

.tk-header-spacer {
  width: 30%;
}
</style>
