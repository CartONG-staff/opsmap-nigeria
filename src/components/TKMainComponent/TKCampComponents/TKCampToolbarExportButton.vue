<template>
  <div class="tk-camp-toolbar-container">
    <v-dialog>
      <template v-slot:activator="{ on: dialog, attrs }">
        <v-tooltip top>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              icon
              large
              color="accent"
              height="44"
              width="44"
              :disabled="!dataset.currentCamp"
              v-bind="attrs"
              v-on="{ ...tooltip, ...dialog }"
            >
              <v-icon dark>
                mdi-file-pdf-outline
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t("site.exportPreffix") }} PDF</span>
        </v-tooltip>
      </template>
      <v-card class="tk-camp-pdf-container">
        <TKCampPDF
          :visualizerOptions="visualizerOptions"
          :dataset="dataset"
          :appConfig="appConfig"
        />
      </v-card>
    </v-dialog>

    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          color="accent"
          height="44"
          width="44"
          :disabled="!dataset.currentCamp"
          @click="exportToCSV()"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>
            mdi-file-delimited-outline
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t("site.exportPreffix") }} CSV</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import TKCampPDF from "./TKCampPDF.vue";
import { TKCSVWrite } from "@/domain/export/TKCSVWriter";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Vue, Prop } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "./TKSubmissionVisualizer";
import { TKOpsmapConfiguration } from "@/domain";

@Component({
  components: {
    TKCampPDF
  }
})
export default class TKCampToolbarExportButton extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;
  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  exportToCSV() {
    if (this.dataset && this.dataset.currentSubmission) {
      TKCSVWrite(this.dataset, this.$root.$i18n.locale);
    }
  }
}
</script>

<style scoped>
.tk-camp-toolbar-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: top;
}
</style>
<style>
.v-dialog--active {
  max-width: 21cm !important;
}
</style>
