<template>
  <div class="tk-maincomponent">
    <v-btn v-on:click="switchPage()">{{ $t("main.switchPage") }}</v-btn>
    <TKHomePage v-if="isHomePage" :appConfig="appConfig" />
    <TKCampPage v-if="!isHomePage" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";

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
  background-image: url("https://streetartutopia.com/wp-content/uploads/2019/12/BANKSY-Bench-Birmingham_Moment.jpg");
  background-size: 100% 100%;
  padding-left: var(--side-padding);
  padding-right: var(--side-padding);
}
</style>
