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
      <h3 class="secondary--text">{{ appConfig.name }}</h3>
    </div>
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
  background-color: antiquewhite;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  vertical-align: middle;
  height: 100px;
}

.tk-header > * {
  margin: 0 50px;
}

.tk-header-logos {
  display: flex;
  flex-flow: row wrap;
  column-gap: 5px;
}

.tk-header-logos > * {
  margin: auto;
}

.tk-header-logos-item-logo {
  height: 50px;
}

.tk-header-title {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
s
