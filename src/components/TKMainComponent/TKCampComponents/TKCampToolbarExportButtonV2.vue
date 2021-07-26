<template>
  <div class="tk-camp-toolbar-container">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          color="accent"
          height="44"
          width="44"
          :disabled="!dataset.currentCamp"
          @click="exportToPDF()"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>
            mdi-file-pdf-outline
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t("site.exportPreffix") }} PDF</span>
    </v-tooltip>
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
import { TKCSVWrite } from "@/domain/export/TKCSVWriter";
import { TKPDFWrite } from "@/domain/export/TKPDFWriter";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class TKCampToolbarExportButton extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;
  readonly exportFormats = ["PDF", "CSV"];
  exportModel = "PDF";

  resetSelected() {
    this.exportModel = "";
  }

  exportToPDF() {
    if (this.dataset && this.dataset.currentSubmission) {
      // console.log("Export to PDF");
      TKPDFWrite(this.dataset, this.$root.$i18n.locale);
    }
  }

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
