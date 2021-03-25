<template>
  <div class="tk-maincomponent">
    <v-btn v-on:click="switchPage()">{{ $t("main.switchPage") }}</v-btn>
    <TKHomePage v-if="isHomePage" :appConfig="appConfig" />
    <TKCampPage v-if="!isHomePage" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/Config/TKGeneralConfiguration";

import TKCampPage from "./TKCampPage";
import TKHomePage from "./TKHomePage";

@Component({
  components: {
    TKCampPage,
    TKHomePage,
  },
})
export default class TKMainComponent extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;

  isHomePage = true;
  switchPage() {
    this.isHomePage = !this.isHomePage;
  }
}
</script>

<style scoped>
.tk-maincomponent {
  background-color: whitesmoke;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}
</style>
