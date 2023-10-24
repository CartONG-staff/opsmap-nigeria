<template lang="html">
  <div>
    <transition mode="out-in" name="fade-in">
      <div class="tk-trafficlight-thematic-container" :key="display">
        <div v-if="display">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
                class="tk-trafficlight-thematic"
                :style="style"
              ></div>
            </template>
            <span>{{ $t(text) }}</span>
          </v-tooltip>
        </div>
        <div v-else class="tk-trafficlight-thematic"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { TKFDFTrafficLightColormapItem } from "@/domain/fdf/TKFDFTrafficLights/TKFDFTrafficLightColormap";

@Component
export default class TKSubmissionEntryTrafficLightComponent extends Vue {
  @Prop()
  readonly trafficLight!: TKFDFTrafficLightColormapItem;

  question = "";
  answer = "";
  text = "";
  display = false;
  style = {
    backgroundColor: "none"
  };

  get locale() {
    return this.$root.$i18n.locale;
  }

  @Watch("trafficLight", { immediate: true })
  ontrafficLightChanged() {
    if (this.trafficLight) {
      this.display = true;
      this.style.backgroundColor = this.trafficLight.color;
    } else {
      this.display = false;
      this.style.backgroundColor = "none";
    }
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.trafficLight) {
      if (typeof this.trafficLight.label == "string") {
        this.text = this.$root.$i18n.t(this.trafficLight.label).toString();
      } else {
        this.text = TKGetLocalValue(
          this.trafficLight.label,
          this.$root.$i18n.locale
        );
      }
    } else {
      this.text = "";
    }
  }
}
</script>

<style scoped>
.tk-trafficlight-thematic-container {
  margin-right: 10px;
}
.tk-trafficlight-thematic {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  margin: 0 auto;
  background-color: none;
}
</style>
