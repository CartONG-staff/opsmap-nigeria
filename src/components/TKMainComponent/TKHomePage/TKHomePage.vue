<template>
  <div class="tk-homepage"><TKMap /></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TKMap from "@/components/TKMainComponent/TKMap";
@Component({
  components: { TKMap },
})
export default class TKHomePage extends Vue {}
</script>

<style></style>
