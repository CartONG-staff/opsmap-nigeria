<template>
  <div class="tk-camp-toolbar">
    <transition mode="out-in" name="fade-in">
      <div :key="$root.$i18n.locale" class="tk-camp-toolbar-container">
        <v-autocomplete
          v-if="dataset.currentCamp"
          key="1"
          class="tk-camp-toolbar-item"
          background-color="#418fde"
          color="#ffffff"
          :disabled="dataset.sortedSubmissions.length < 2"
          flat
          filled
          solo
          dense
          height="44"
          :items="dataset.sortedSubmissions"
          :prefix="$t('site.datePreffix').toUpperCase()"
          v-model="model"
          @change="dateSelected"
        ></v-autocomplete>
        <v-autocomplete
          v-else
          key="2"
          class="tk-camp-toolbar-item-disabled"
          background-color="#418fde"
          color="#ffffff"
          disabled
          readonly
          flat
          filled
          solo
          dense
          height="44"
          :items="dataset.sortedSubmissions"
          v-model="model"
          @change="dateSelected"
        ></v-autocomplete>
      </div>
    </transition>

    <TKCampToolbarExportButton
      :dataset="dataset"
      class="tk-camp-toolbar-container"
    />

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
              :disabled="!dataset.currentCamp"
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
            v-model="visualizerOptions.hideUnanswered"
          ></v-switch>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { TKCSVWrite } from "@/domain/csv/TKCSVWriter";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizer";
import TKCampToolbarExportButton from "./TKCampToolbarExportButtonV2.vue";

@Component({
  components: {
    TKCampToolbarExportButton
  }
})
export default class TKCampToolbar extends Vue {
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  model = "";
  readonly exportFormats = ["PDF", "CSV"];
  exportModel = "PDF";

  dateSelected(date: string) {
    if (this.dataset.currentDate !== date) {
      this.model = date;
      this.dataset.setCurrentDate(date);
    }
  }

  onExportTriggered(type: string) {
    if (this.dataset && this.dataset.currentSubmission) {
      switch (type) {
        case "PDF":
          console.log("Export to PDF");
          break;
        case "CSV":
          TKCSVWrite(this.dataset, this.$root.$i18n.locale);
          break;
        default:
          console.log("Unkknow Output format");
      }
    }
  }

  @Watch("dataset.currentCamp", { immediate: true })
  onCampChange() {
    this.model =
      this.dataset.sortedSubmissions && this.dataset.sortedSubmissions.length
        ? this.dataset.sortedSubmissions[0]
        : "";
  }

  @Watch("dataset.currentDate", { immediate: true })
  onDateChange() {
    this.model = this.dataset.currentDate;
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

.tk-camp-toolbar-item.theme--light.v-input input {
  color: #fff !important;
  font-family: "Arial";
  font-weight: bold !important;
  font-size: 12px !important;
  letter-spacing: 0.86px !important;
}

.tk-camp-toolbar-item .v-icon.v-icon {
  color: #fff !important;
}

.tk-camp-toolbar-item .theme--light.v-icon.v-icon.v-icon--disabled {
  opacity: 1 !important;
}

.tk-camp-toolbar-item-disabled.v-input--is-disabled .v-input__slot {
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
