<template>
  <div>
    <TKCampIndicators :dataset="dataset" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKCampIndicators } from "./TKCampComponents";
import { TKDataset } from "@/domain/survey/TKDataset";
@Component({
  components: {
    TKCampIndicators
  }
})
export default class TKMainComponentIndicatorsCamp extends Vue {
  @Prop()
  readonly dataset!: TKDataset;
}
</script>

<style scoped></style>
