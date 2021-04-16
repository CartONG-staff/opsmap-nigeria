<template>
  <div class="tk-camp-subtitle">
    {{ name }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { TKCampDescription } from "@/domain/core/TKCampDescription";

@Component
export default class TKCampSubtitle extends Vue {
  @Prop()
  readonly camp!: TKCampDescription;

  name = this.camp.name;

  @Watch("camp")
  onChange() {
    this.name = this.camp ? this.camp.name : "";
  }
}
</script>

<style scoped>
.tk-camp-subtitle {
  color: var(--v-campTitle-base);
  font-size: 30px;
  line-height: 1.467;
}
</style>
