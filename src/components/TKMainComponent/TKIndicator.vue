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
    <div class="tk-indicator-icon-container">
      <img class="tk-indicator-icon" :src="iconUrl" />
    </div>
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
  box-shadow: 0px 2px 5px 0px #00000011;
  background-color: white;
  border-color: transparent;
  border-radius: 5px;
  height: 100px;
  overflow: hidden;
}
.tk-indicator-icon-container {
  position: relative;
  height: 36px;
  right: 30px;
  top: 16px;
}

.tk-indicator-icon {
  height: 100%;
}

.tk-indicator-value {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: left;
  height: 60px;
  top: 20px;
  left: 30px;
}

.tk-indicator-value-number {
  color: var(--v-accent-base);
  font-size: 40px;
  height: 43px;
  line-height: 43px;
}

.tk-indicator-value-decription {
  color: var;
  font-weight: bold;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
}
</style>
