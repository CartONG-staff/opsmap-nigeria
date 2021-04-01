<template>
  <div class="tk-home-subtitle">{{ $t("home.lastUpdate") }}: 14/02/2002</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TKHomeTitle extends Vue {}
</script>

<style scoped>
.tk-home-subtitle {
  color: var(--v-secondary-base);
  font-size: 11px;
}
</style>
