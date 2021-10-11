<template>
  <div class="tk-home-left">
    <TKHomeSubtitle :dataset="dataset" />
    <TKHomeCombos :dataset="dataset" />
  </div>
</template>

<script lang="ts">
import { TKDataset } from "@/domain/survey/TKDataset";
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKHomeCombos, TKHomeSubtitle } from "./TKHomeComponents";
@Component({
  components: {
    TKHomeCombos,
    TKHomeSubtitle
  }
})
export default class TKMainComponentLeftHome extends Vue {
  @Prop()
  readonly dataset!: TKDataset;
}
</script>

<style scoped>
.tk-home-left {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  row-gap: 25px;
  align-items: left;
}
</style>
