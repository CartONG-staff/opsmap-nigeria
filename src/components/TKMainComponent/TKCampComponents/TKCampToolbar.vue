<template>
  <div class="tk-camp-toolbar">
    <v-select
      background-color="#418fde"
      color="#ffffff"
      :items="submissionsDates"
      v-model="model"
      :disabled="model == ''"
      flat
      filled
      solo
      dense
      class="tk-camp-toolbar-date"
      height="44"
      @change="dateSelected"
    ></v-select>
    <transition mode="out-in" name="fade-in">
      <v-btn
        :key="$root.$i18n.locale"
        depressed
        color="#000"
        elevation="0"
        class="tk-camp-toolbar-export"
        height="44"
        :disabled="model == ''"
      >
        {{ $t("site.exportAsCSV") }}
      </v-btn>
    </transition>

    <v-menu
      :offset-y="true"
      :close-on-content-click="false"
      class="tk-camp-toolbar-kebab"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          small
          color="accent"
          v-bind="attrs"
          v-on="on"
          height="44"
          width="44"
          :disabled="model == ''"
        >
          <v-icon dark>
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-switch
            :label="$t('site.hideUnanswered')"
            color="accent"
            hide-details
            v-model="options.hideUnanswered"
          ></v-switch>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizer";
@Component
export default class TKCampToolbar extends Vue {
  @Prop()
  readonly submissionsDates!: [""];

  @Prop()
  readonly options!: TKSubmissionVisualizerOptions;

  model =
    this.submissionsDates && this.submissionsDates.length
      ? this.submissionsDates[0]
      : "";

  @Watch("submissionsDates")
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
  flex-flow: row nowrap;
  align-items: top;
  column-gap: 5px;
}

.tk-camp-toolbar-date {
  width: 40%;
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

.tk-camp-toolbar .v-input--is-disabled .v-input__slot {
  background-color: rgba(0, 0, 0, 0.12) !important;
}
</style>
