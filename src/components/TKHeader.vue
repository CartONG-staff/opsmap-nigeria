<template lang="html">
  <v-app-bar-title>
    <div class="tk-header">
      <div class="tk-header-logos">
        <div
          v-for="{ partnerName, urlLogo, urlRedirection } in partners"
          :key="partnerName"
        >
          <a :href="urlRedirection" style="display:block" target="_blank">
            <img :src="urlLogo" :alt="partnerName" class="opsmapLogo" />
          </a>
        </div>
      </div>
      <div class="d-flex align-center justify-end">
        <h3 class="secondary--text">Opsmap Name: {{ opsmapName }}</h3>
      </div>
    </div>
  </v-app-bar-title>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

import { TKPartnerInfos } from "@/domain/TKPartnerInfos";

@Component
export default class TKHeader extends Vue {
  @Prop({ type: String, default: "NAME-NOT-DEFINED" })
  readonly opsmapName!: string;

  @Prop({
    default: () => []
  })
  readonly partners!: Array<TKPartnerInfos>;
}
</script>

<style scoped>
.tk-header {
  background-color: darkslategray;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

.tk-header > * {
  margin: 0 50px;
}

.tk-header-logos {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  background-color: bisque;
}

.tk-header-logos > * {
  margin: 0 15px;
}

.opsmapLogo {
  height: 50px;
}
</style>
s
