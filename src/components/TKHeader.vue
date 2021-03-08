<template lang="html">
  <div class="hea">
    <h1>TKFooter from {{ source }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TKHeader extends Vue {
  @Prop({ type: String, default: "" })
  readonly source!: string;
}
</script>

<style scoped>
.hea {
  background-color: darkred;
}
.hea h1 {
  color: #42b983;
}
</style>
