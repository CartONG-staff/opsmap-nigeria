<template>
  <v-app>
    <v-main>
      <div class="tk-main">
        <TKHeader :appConfig="appConfig" />
        <TKMainComponent class="tk-main-dashboard" :appConfig="appConfig" />
        <TKFooter :appConfig="appConfig" />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";
import { APPCONFIG } from "@/app-demo/config";

import { TKFooter, TKMainComponent, TKHeader } from "@/components"; // @ is an alias to /src

@Component({
  components: {
    TKHeader,
    TKFooter,
    TKMainComponent,
  },
})
export default class App extends Vue {
  private appConfig: TKGeneralConfiguration = APPCONFIG;
}
</script>

<style>
body {
  min-height: 100vh; /* toute la hauteur du viewport (compatible IE9+) */
  --padding-small: 5px;
  --padding-medium: 10px;
  --padding-large: 15px;
  --side-padding: 10%;
}
.tk-main {
  display: flex;
  flex-flow: column nowrap;
  row-gap: 0px;
  height: 100%;
  width: 100%;
}
.tk-main-dashboard {
  flex-grow: 2;
}
</style>
