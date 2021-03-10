<template lang="html">
  <div class="tk-header">
    <div class="tk-header-logos">
      <div
        v-for="{ name, urlLogo, urlRedirection } in clusterMembers"
        :key="name"
        class="tk-header-logos-item"
      >
        <a :href="urlRedirection" target="_blank">
          <img :src="urlLogo" :alt="name" class="tk-header-logos-item-logo" />
        </a>
      </div>
    </div>
    <div class="tk-header-title">
      <h3 class="secondary--text">Opsmap Name: {{ country.name }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

import { TKClusterMemberInfos, TKCountry } from "@/domain";

@Component
export default class TKHeader extends Vue {
  @Prop()
  readonly country!: TKCountry;

  @Prop({
    default: () => []
  })
  readonly clusterMembers!: Array<TKClusterMemberInfos>;
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
