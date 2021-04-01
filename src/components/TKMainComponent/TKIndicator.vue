<template>
  <div class="tk-indicator">
    <div class="tk-indicator-value">
      <div class="tk-indicator-value-number">
        {{ indicator.value }}
      </div>
      <div class="tk-indicator-value-decription">
        {{ indicator.name }}
      </div>
    </div>
    <img class="tk-indicator-icon" :src="iconUrl" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { TKIndicator } from "@/domain/UI/TKIndicator";
import { TKIconUrl } from "@/domain/UI/TKIcons";

@Component
export default class TKIndicatorComponent extends Vue {
  @Prop()
  readonly indicator!: TKIndicator;
  readonly iconUrl = TKIconUrl(this.indicator.iconOchaName);
}
</script>

<style scoped>
.tk-indicator {
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

.tk-indicator-value {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: left;
}

.tk-indicator-value-number {
  color: var(--v-accent-base);
  font-size: 40px;
}

.tk-indicator-value-decription {
  color: var;
  font-weight: bold;
  font-size: 16px;
}

.tk-indicator-icon {
  align-self: flex-start;
  height: 36px;
  display: block;
}
</style>
