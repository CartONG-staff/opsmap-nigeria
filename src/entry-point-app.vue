<template>
  <v-app>
    <v-main>
      <TKHeader />
      <TKCampSelector />
      <TKInfosDisplayer />
      <TKFooter />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  TKHeader,
  TKFooter,
  TKCampSelector,
  TKInfosDisplayer
} from "@/components"; // @ is an alias to /src

@Component({
  components: {
    TKCampSelector,
    TKHeader,
    TKFooter,
    TKInfosDisplayer
  }
})
export default class App extends Vue {}
</script>

<style></style>
