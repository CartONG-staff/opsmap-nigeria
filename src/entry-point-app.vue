<template>
  <v-app>
    <v-main>
      <TKHeader :appConfig="appConfig" />
      <TKDashBoard />
      <TKFooter :appConfig="appConfig" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GeneralConfiguration } from "./domain/TKGeneralConfiguration";
import { APPCONFIG } from "@/testouille/config";

import { TKFooter, TKDashBoard, TKHeader } from "@/components"; // @ is an alias to /src

@Component({
  components: {
    TKHeader,
    TKFooter,
    TKDashBoard,
  },
})
export default class App extends Vue {
  private appConfig: GeneralConfiguration = APPCONFIG;
}
</script>

<style>
body {
  min-height: 100vh; /* toute la hauteur du viewport (compatible IE9+) */
  --padding-small: 10px;
  --padding-medium: 25px;
  --padding-large: 50px;
  --side-padding: 5%;
}
</style>
