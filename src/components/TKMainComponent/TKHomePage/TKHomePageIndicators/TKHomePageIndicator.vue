<template>
  <div class="tk-homepage-indicator">
    <div class="tk-homepage-indicator-value">
      <div class="tk-homepage-indicator-value-number">
        {{ indicator.value }}
      </div>
      <div class="tk-homepage-indicator-value-decription">
        {{ indicator.name }}
      </div>
    </div>
    <div class="tk-homepage-indicator-icon"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { TKHomeIndicator } from "@/domain/TKHomeIndicator";

@Component({})
export default class TKHomePageIndicator extends Vue {
  @Prop()
  readonly indicator!: TKHomeIndicator;
}
</script>

<style scoped>
.tk-homepage-indicator {
  background-color: white;
  border-color: transparent;
  border-radius: 5px;
  /* height: 200px; */
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.tk-homepage-indicator-value {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: left;
}

.tk-homepage-indicator-value-number {
  color: var(--v-secondary-base);
  font-size: 30px;
}

.tk-homepage-indicator-value-decription {
  color: var(#fff);
  font-weight: bold;
  font-size: 20px;
}

.tk-homepage-indicator-icon {
  align-self: flex-start;
  background-image: url("https://img.icons8.com/cotton/2x/info--v3.png");
  background-size: 100% 100%;

  height: 60px;
  width: 60px;
  display: block;
}
</style>
