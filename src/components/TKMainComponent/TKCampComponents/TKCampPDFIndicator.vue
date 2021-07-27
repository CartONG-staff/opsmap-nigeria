<template>
  <div class="indicator">
    <div class="tk-indicator-container">
      <div class="tk-indicator-icon-container">
        <img class="tk-indicator-icon" :src="iconUrl" />
      </div>
      <div class="tk-indicator-value">
        <div class="tk-indicator-value-number">
          {{ value }}
        </div>
        <div class="tk-indicator-value-decription">
          {{ name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKIndicator } from "@/domain/ui/TKIndicator";
import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class TKCampPDFIndicator extends Vue {
  @Prop()
  readonly indicator!: TKIndicator;

  iconUrl = "";
  value = "";
  name = "";
  mounted() {
    this.iconUrl = TKIconUrl(this.indicator.iconOchaName);
    this.value = TKGetLocalValue(this.indicator.valueLabel, this.$i18n.locale);
    this.name = TKGetLocalValue(this.indicator.nameLabel, this.$i18n.locale);
  }
}
</script>

<style scoped>
.tk-indicator-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  column-gap: 5mm;
  padding: 5mm;
  align-items: left;
  width: 100%;
}

.tk-indicator-value {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: left;
  height: 100%;
  width: 100%;
}

.tk-indicator-value-number {
  width: 100%;
  color: var(--v-accent-base);
  font-size: 16pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tk-indicator-value-decription {
  font-size: 12px;
  font-weight: bold;
  color: #999;
  letter-spacing: 0.86;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tk-indicator-icon-container {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.tk-indicator-icon {
  height: 6mm;
  width: auto;
}
</style>
