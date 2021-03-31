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
    <img class="tk-homepage-indicator-icon" :src="indicator.icon"></img>
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
  color: var(--v-accent-base);
  font-size: 40px;
}

.tk-homepage-indicator-value-decription {
  color: var;
  font-weight: bold;
  font-size: 16px;
}

.tk-homepage-indicator-icon {
  align-self: flex-start;
  height: 36px;
  display: block;
}
</style>
