<template>
  <div class="tk-home-indicator">
    <div class="tk-home-indicator-value">
      <div class="tk-home-indicator-value-number">
        {{ indicator.value }}
      </div>
      <div class="tk-home-indicator-value-decription">
        {{ indicator.name }}
      </div>
    </div>
    <img class="tk-home-indicator-icon" :src="indicator.icon" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { TKIndicator } from "@/domain/UI/TKIndicator";

@Component
export default class TKHomeIndicator extends Vue {
  @Prop()
  readonly indicator!: TKIndicator;
}
</script>

<style scoped>
.tk-home-indicator {
  background-color: white;
  border-color: transparent;
  border-radius: 5px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  height: 100px;
}

.tk-home-indicator-value {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: left;
}

.tk-home-indicator-value-number {
  color: var(--v-accent-base);
  font-size: 40px;
}

.tk-home-indicator-value-decription {
  color: var;
  font-weight: bold;
  font-size: 16px;
}

.tk-home-indicator-icon {
  align-self: flex-start;
  height: 36px;
  display: block;
}
</style>
