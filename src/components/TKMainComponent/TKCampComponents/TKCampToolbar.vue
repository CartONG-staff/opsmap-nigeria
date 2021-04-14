<template>
  <div class="tk-camp-toolbar">
    <v-select
      background-color="#418fde"
      color="#ffffff"
      :items="submissionsDates"
      v-model="model"
      flat
      filled
      solo
      dense
      class="tk-camp-toolbar-date"
      height="44"
      @change="dateSelected"
    ></v-select>
    <v-btn
      depressed
      color="#000"
      elevation="0"
      class="tk-camp-toolbar-export"
      height="44"
    >
      {{ $t("site.exportAsCSV") }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class TKCampToolbar extends Vue {
  @Prop()
  readonly submissionsDates!: [""];
  model = "";

  @Watch("submissionsDates", { immediate: true })
  onChange() {
    this.model =
      this.submissionsDates && this.submissionsDates.length
        ? this.submissionsDates[0]
        : "";
  }

  dateSelected(date: string) {
    if (date) {
      this.$emit("date-selection-changed", date);
    }
  }
}
</script>

<style>
.tk-camp-toolbar {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  align-items: top;
  column-gap: 5%;
}

.tk-camp-toolbar-date {
  width: 55%;
}
.tk-camp-toolbar-export {
  width: 40%;
}

.tk-camp-toolbar-export .v-btn__content {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-date .v-select__selection {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-date .v-icon.v-icon {
  color: #fff !important;
}
</style>
