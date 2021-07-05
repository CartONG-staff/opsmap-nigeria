<template>
  <div class="tk-camp-toolbar">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-camp-toolbar-container">
        <v-autocomplete
          v-if="model !== ''"
          key="1"
          class="tk-camp-toolbar-date"
          background-color="#418fde"
          color="#ffffff"
          :disabled="submissionsDates.length < 2"
          flat
          filled
          solo
          dense
          height="44"
          :items="submissionsDates"
          :prefix="$t('site.dateSuffix').toUpperCase()"
          v-model="model"
          @change="dateSelected"
        ></v-autocomplete>
        <v-autocomplete
          v-else
          key="2"
          class="tk-camp-toolbar-date-disabled"
          background-color="#418fde"
          color="#ffffff"
          disabled
          readonly
          flat
          filled
          solo
          dense
          height="44"
          :items="submissionsDates"
          v-model="model"
          @change="dateSelected"
        ></v-autocomplete>
      </div>
    </transition>

    <transition mode="out-in" name="fade-in">
      <v-btn
        :key="$root.$i18n.locale"
        depressed
        color="#000"
        elevation="0"
        class="tk-camp-toolbar-export"
        height="44"
        v-on:click="onExportTriggered"
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
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              icon
              small
              color="accent"
              height="44"
              width="44"
              :disabled="model == ''"
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon dark>
                mdi-dots-vertical
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t("site.extraTools") }}</span>
        </v-tooltip>
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
import { TKCSVWrite } from "@/domain/csv/TKCSVWriter";
import { TKDatasetFilterer } from "@/domain/survey/TKFilters";
import { TKSubmission } from "@/domain/survey/TKSubmission";
import { sortDates } from "@/domain/survey/TKSurvey";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizer";
@Component
export default class TKCampToolbar extends Vue {
  @Prop()
  readonly submissionsDatesUnsorted!: [""];
  submissionsDates = [""];

  @Prop()
  readonly options!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly currentSubmission!: TKSubmission;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  model = "";

  @Watch("submissionsDatesUnsorted", { immediate: true })
  onChange() {
    this.submissionsDates = sortDates(this.submissionsDatesUnsorted);
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

  onExportTriggered() {
    if (this.dataset && this.currentSubmission) {
      TKCSVWrite(
        this.dataset,
        this.currentSubmission,
        this.model,
        this.$root.$i18n.locale
      );
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
.tk-camp-toolbar-date-container {
  width: 40%;
  min-width: 50px;
}

.tk-camp-toolbar-date-single {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-export {
  width: 40%;
  min-width: 50px;
  overflow: hidden;
}
.tk-camp-toolbar-export .v-btn__content {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-date.theme--light.v-input input {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-date .v-icon.v-icon {
  color: #fff !important;
}

.tk-camp-toolbar-date .theme--light.v-icon.v-icon.v-icon--disabled {
  opacity: 1 !important;
}

.tk-camp-toolbar-date-disabled.v-input--is-disabled .v-input__slot {
  background-color: rgba(0, 0, 0, 0.12) !important;
}

.tk-camp-toolbar input::placeholder {
  color: #f1f3f3 !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar .v-text-field__suffix,
.tk-camp-toolbar .v-text-field__prefix {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
