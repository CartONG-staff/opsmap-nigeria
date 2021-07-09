<template>
  <div>
    <TKHomeMoreInfos :appConfig="appConfig" />
    <TKIFrame :url="appConfig.iframe" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TKIFrame from "@/components/TKExtras/TKIFrame.vue";
import { TKHomeMoreInfos } from "./TKHomeComponents";
import { TKOpsmapConfiguration } from "@/domain";

@Component({
  components: {
    TKIFrame,
    TKHomeMoreInfos
  }
})
export default class TKMainComponentLeftHome extends Vue {
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;
}
</script>

<style scoped></style>
