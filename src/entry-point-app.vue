<template>
  <v-app>
    <v-main>
      <TKHeader source="generic lib - HEADER" />
      <TKCampSelector />
      <TKFooter source="generic lib - FOOTER" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TKHeader, TKFooter, TKCampSelector } from "@/components"; // @ is an alias to /src

@Component({
  components: {
    TKHeader,
    TKFooter,
    TKCampSelector
  }
})
export default class App extends Vue {}
</script>

<style></style>
