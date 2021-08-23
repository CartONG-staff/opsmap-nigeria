<template>
  <div>
    <TKCampIndicators :appConfig="appConfig" :dataset="dataset" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKCampIndicators } from "./TKCampComponents";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKOpsmapConfiguration } from "@/domain";
@Component({
  components: {
    TKCampIndicators
  }
})
export default class TKMainComponentIndicatorsCamp extends Vue {
  @Prop()
  readonly dataset!: TKDataset;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
}
</script>

<style scoped></style>
