<template>
  <div class="tk-indicator">
    <img
      v-if="backgroundType === 1"
      class="tk-indicator-bg"
      src="@/assets/bg-indicator-1.png"
    />
    <img
      v-if="backgroundType === 2"
      class="tk-indicator-bg"
      src="@/assets/bg-indicator-2.png"
    />
    <img
      v-if="backgroundType === 3"
      class="tk-indicator-bg"
      src="@/assets/bg-indicator-3.png"
    />

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

import { TKIndicator, TKIndicatorBackground } from "@/domain/UI/TKIndicator";
import { TKIconUrl } from "@/domain/UI/TKIcons";

@Component
export default class TKIndicatorComponent extends Vue {
  @Prop()
  readonly backgroundType!: TKIndicatorBackground;
  // 1 or 2 or 3. no background if anything else.
  // Couldn't make enum work with that

  @Prop()
  readonly indicator!: TKIndicator;
  readonly iconUrl = TKIconUrl(this.indicator.iconOchaName);
}
</script>

<style scoped>
.tk-indicator {
  position: relative;
  box-shadow: 0px 2px 5px 0px #00000011;
  background-color: white;
  border-color: transparent;
  border-radius: 5px;
  height: 100px;
  overflow: hidden;
}

.tk-indicator-icon-container {
  position: absolute;
  height: 36px;
  right: 30px;
  bottom: 55px;
}

.tk-indicator-icon {
  height: 100%;
}

.tk-indicator-value {
  position: absolute;
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
  color: var(--v-quaternary-base);
  font-weight: bolder;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
}

.tk-indicator-bg {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 129px;
  height: 63px;
}
</style>
