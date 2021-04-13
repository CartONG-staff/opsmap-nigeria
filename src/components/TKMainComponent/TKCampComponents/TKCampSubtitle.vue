<template>
  <div class="tk-camp-subtitle">
    {{ name }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TKCampSubtitle extends Vue {
  @Prop()
  readonly name!: string;
}
</script>

<style scoped>
.tk-camp-subtitle {
  color: var(--v-campTitle-base);
  font-size: 30px;
  line-height: 1.467;
}
</style>
