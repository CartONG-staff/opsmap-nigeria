<template>
  <div class="tk-maincomponent">
    <v-btn v-on:click="switchPage()">Switch page</v-btn>
    <TKHomePage v-if="isHomePage" />
    <TKCampPage v-if="!isHomePage" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import TKCampPage from "./TKCampPage";
import TKHomePage from "./TKHomePage";

@Component({
  components: {
    TKCampPage,
    TKHomePage,
  },
})
export default class TKMainComponent extends Vue {
  isHomePage = true;
  switchPage() {
    this.isHomePage = !this.isHomePage;
  }
}
</script>

<style>
.tk-maincomponent {
  background-image: url("https://streetartutopia.com/wp-content/uploads/2019/12/BANKSY-Bench-Birmingham_Moment.jpg");
  background-size: 100% 100%;
}
</style>
