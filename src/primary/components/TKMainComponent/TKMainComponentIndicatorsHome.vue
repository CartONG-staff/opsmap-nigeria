<template>
  <div>
    <TKHomeIndicators class="tk-home-indicators" :dataset="dataset" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKHomeIndicators } from "./TKHomeComponents";
import { TKDataset } from "@/domain/survey/TKDataset";
@Component({
  components: {
    TKHomeIndicators
  }
})
export default class TKMainComponentIndicatorsCamp extends Vue {
  @Prop()
  readonly dataset!: TKDataset;
}
</script>

<style scoped></style>
