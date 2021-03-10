<template lang="html">
  <div class="tk-header">
    <v-app-bar-title>
      <div class="d-flex justify-space-around header">
        <div class="d-flex align-center justify-start">
          <a :href="urlRedirection" style="display:block" target="_blank">
            <img :src="urlLogo" alt="" class="opsmapLogo" />
          </a>
        </div>
        <div class="d-flex align-center justify-end">
          <h3 class="secondary--text">CCCM SITE TRACKER {{ opsmapName }}</h3>
        </div>
      </div>
    </v-app-bar-title>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class TKHeader extends Vue {
  @Prop({ type: String, default: "NAME-NOT-DEFINED" })
  readonly opsmapName!: string;

  @Prop({ type: String, default: "https://www.google.com" })
  readonly urlRedirection!: string;

  @Prop({
    type: String,
    default: "https://www.hicom.fr/wp-content/uploads/2017/09/Logo_TV_2015.png"
  })
  readonly urlLogo!: string;
}
</script>

<style scoped>
.tk-header {
  background-color: dodgerblue;
}
</style>
