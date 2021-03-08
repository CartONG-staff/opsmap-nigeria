<template lang="html">
  <div class="foo">
    <h1>TKFooter from {{ source }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TKFooter extends Vue {
  @Prop({ default: "", type: String })
  readonly source!: string;
}
</script>

<style scoped>
.foo {
  background-color: darkred;
}
.foo h1 {
  color: #42b983;
}
</style>
