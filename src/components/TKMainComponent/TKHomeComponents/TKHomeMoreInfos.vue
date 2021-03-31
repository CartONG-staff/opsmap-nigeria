<template>
  <div class="tk-home-moreinfos">
    <div class="tk-home-moreinfos-title">
      {{ $t("home.moreInfosTitle") }}
    </div>
    <div class="tk-home-moreinfos-content">
      {{ $t("home.moreInfosContent") }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKHomeIndicators extends Vue {}
</script>

<style scoped>
.tk-home-moreinfos {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: top;
  border: 2px solid #f1f3f3;
  box-sizing: border-box;
  background-color: var(--v-background-base);
  width: 100%;
  padding-top: 42px;
  padding-bottom: 42px;
  padding-left: 30px;
  padding-right: 30px;
}

.tk-home-moreinfos-title {
  width: 30%;
  font-weight: bold;
  font-size: 12px;
  color: var(--v-secondary-base);
  letter-spacing: 0.86px;
}

.tk-home-moreinfos-content {
  width: 65%;
  font-size: 16px;
  color: var(--v-primary-base);
  line-height: 1.375;
  text-align: justify;
  text-justify: inter-word;
}
</style>
