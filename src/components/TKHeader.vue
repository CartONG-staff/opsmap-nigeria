<template lang="html">
  <div class="tk-header">
    <div class="tk-header-logos">
      <div
        v-for="{ partnerName, urlLogo, urlRedirection } in partners"
        :key="partnerName"
        class="tk-header-logos-item"
      >
        <a :href="urlRedirection" target="_blank">
          <img :src="urlLogo" :alt="partnerName" class="opsmapLogo" />
        </a>
      </div>
    </div>
    <div class="d-flex align-center justify-end">
      <h3 class="secondary--text">Opsmap Name: {{ country.name }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

import { TKPartnerInfos, TKCountry } from "@/domain";

@Component
export default class TKHeader extends Vue {
  @Prop()
  readonly country!: TKCountry;

  @Prop({
    default: () => []
  })
  readonly partners!: Array<TKPartnerInfos>;
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

.opsmapLogo {
  height: 50px;
}
</style>
s
