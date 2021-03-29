<template>
  <div class="tk-homepage-moreinfos">
    <div class="tk-homepage-moreinfos-title">
      {{ $t("home.moreInfosTitle") }}
    </div>
    <div class="tk-homepage-moreinfos-content">
      {{ $t("home.moreInfosContent") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKHomePageIndicators extends Vue {}
</script>

<style scoped>
.tk-homepage-moreinfos {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  border: 5px solid #f2f2f2;
  background-color: white;
  width: 100%;
}

.tk-homepage-moreinfos-title {
  width: 30%;
  padding-top: var(--padding-large);
  padding-left: var(--padding-large);
}

.tk-homepage-moreinfos-content {
  width: 65%;
  padding-top: var(--padding-large);
  padding-bottom: var(--padding-large);
  padding-right: var(--padding-large);
}
</style>
