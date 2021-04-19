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

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <div class="tk-indicator-value" v-bind="attrs" v-on="on">
          <div class="tk-indicator-value-number">
            {{ value }}
          </div>
          <div class="tk-indicator-value-decription">
            {{ name }}
          </div>
        </div>
      </template>
      <span>{{ name }} : {{ value }}</span>
    </v-tooltip>
    <div class="tk-indicator-icon-container">
      <img class="tk-indicator-icon" :src="iconUrl" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { TKIndicator } from "@/domain/core/TKIndicator";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKGetLocalValue } from "@/domain/core/TKFieldLabel";

@Component
export default class TKIndicatorComponent extends Vue {
  @Prop()
  readonly backgroundType!: number;
  // 1 or 2 or 3. no background if anything else.
  // Couldn't make enum work with that

  @Prop()
  readonly indicator!: TKIndicator;
  iconUrl = "";
  value = "";
  name = "";

  @Watch("indicator", { immediate: true })
  handleIndicatorChange() {
    this.iconUrl = this.indicator ? TKIconUrl(this.indicator.iconOchaName) : "";
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.indicator) {
      this.name = TKGetLocalValue(
        this.indicator.nameLabel,
        this.$root.$i18n.locale
      );
      this.value = TKGetLocalValue(
        this.indicator.valueLabel,
        this.$root.$i18n.locale
      );
    } else {
      this.value = "";
      this.name = "";
    }
  }
}
</script>

<style scoped>
.tk-indicator {
  position: relative;
  box-shadow: 0px 2px 5px 0px #00000011;
  background-color: white;
  border-color: transparent;
  border-radius: 5px;
  min-height: 100px;
  overflow: hidden;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
}

.tk-indicator-icon-container {
  padding-right: 36px;
  padding-bottom: 55px;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
}

.tk-indicator-icon {
  height: 36px;
  width: auto;
}
.tk-indicator-value {
  display: flex;
  flex-flow: column nowrap;
  align-items: left;
  padding-left: 30px;

  width: 80%;
}

.tk-indicator-value-number {
  width: 100%;
  color: var(--v-accent-base);
  font-size: 40px;
  line-height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tk-indicator-value-decription {
  color: var(--v-quaternary-base);
  font-weight: bolder;
  font-size: 16px;
  line-height: 17px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tk-indicator-bg {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 129px;
  height: 63px;
}
</style>
