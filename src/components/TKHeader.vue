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

type PartnerInfos = {
  partnerName: string;
  urlLogo: string;
  urlRedirection: string;
};

@Component
export default class TKHeader extends Vue {
  @Prop({ type: String, default: "NAME-NOT-DEFINED" })
  readonly opsmapName!: string;

  @Prop({
    default: () => [
      {
        partnerName: "GOOGLE",
        urlLogo:
          "https://www.hicom.fr/wp-content/uploads/2017/09/Logo_TV_2015.png",
        urlRedirection: "https://www.google.com"
      },
      {
        partnerName: "STACKOVERFLOW",
        urlLogo:
          "https://www.hicom.fr/wp-content/uploads/2017/09/Logo_TV_2015.png",
        urlRedirection:
          "https://stackoverflow.com/questions/7653483/github-relative-link-in-markdown-file/7658676"
      }
    ]
  })
  readonly partners!: Array<PartnerInfos>;
}
</script>

<style scoped>
.tk-header {
  background-color: black;
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
  height: 100px;
} 

</style>
s
