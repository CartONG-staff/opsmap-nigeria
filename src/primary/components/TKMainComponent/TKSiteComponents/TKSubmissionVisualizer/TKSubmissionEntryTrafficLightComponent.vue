<template lang="html">
  <div>
    <transition mode="out-in" name="fade-in">
      <div class="tk-trafficlight-container" :key="display">
        <div v-if="display">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
                class="tk-trafficlight"
                :style="style"
              ></div>
            </template>
            <span>{{ $t(text) }}</span>
          </v-tooltip>
        </div>
        <div v-else class="tk-trafficlight"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

import { TKGetLocalValue } from "@/domain/utils/TKLabel";
import { TKSubmissionEntryTrafficLight } from "@/domain/survey/TKSubmissionEntry";

@Component
export default class TKSubmissionEntryTrafficLightComponent extends Vue {
  @Prop()
  readonly trafficLight!: TKSubmissionEntryTrafficLight;

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
      this.style.backgroundColor = this.trafficLight.value.color;
    } else {
      this.display = false;
      this.style.backgroundColor = "none";
    }
    this.handleLocale();
  }

  @Watch("$root.$i18n.locale")
  handleLocale() {
    if (this.trafficLight) {
      if (typeof this.trafficLight.value.label == "string") {
        this.text = this.$root.$i18n
          .t(this.trafficLight.value.label)
          .toString();
      } else {
        this.text = TKGetLocalValue(
          this.trafficLight.value.label,
          this.$root.$i18n.locale
        );
      }
    } else {
      this.text = "";
    }
  }
}
</script>
