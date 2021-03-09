<template>
  <v-app>
    <v-main>
      <TKHeader />
      <div class="tk-app-layout">
        <TKCampSelector />
        <TKSurveyVisualizer />
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
  TKSurveyVisualizer
} from "@/components"; // @ is an alias to /src

@Component({
  components: {
    TKCampSelector,
    TKHeader,
    TKFooter,
    TKSurveyVisualizer
  }
})
export default class App extends Vue {}
</script>

<style>
.tk-app-layout {
  background-color: red;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-around;
  padding: 500;
}

.tk-app-layout > * {
  margin: 0 20px;
}

.tk-infos-displayer {
  flex: 1;
}
</style>
