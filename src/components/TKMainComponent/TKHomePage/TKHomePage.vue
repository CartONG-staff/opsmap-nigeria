<template>
  <div class="tk-homepage"><TKMap :config="appConfig.mapConfig" /></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TKGeneralConfiguration } from "@/domain/TKGeneralConfiguration";
import TKMap from "@/components/TKMainComponent/TKMap";
@Component({
  components: { TKMap },
})
export default class TKHomePage extends Vue {
  @Prop()
  readonly appConfig!: TKGeneralConfiguration;
}
</script>

<style></style>
