<template>
  <div class="pdf-document-container">
    <div class="pdf-document" ref="pdf-document">
      <div class="pdf-document-content">
        <TKSubmissionToPDFHeader :appConfig="appConfig" />
        <div class="header-separator"></div>
        <TKSubmissionToPDFHeadlines :appConfig="appConfig" :dataset="dataset" />
        <div class="header-separator"></div>
        <TKSubmissionToPDFIndicators
          :appConfig="appConfig"
          :dataset="dataset"
        />
        <div class="header-separator"></div>
        <!-- <TKSubmissionToPDFubmission
          :appConfig="appConfig"
          :dataset="dataset"
          :visualizerOptions="visualizerOptions"
        /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TKOpsmapConfiguration } from "@/domain";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { Component, Vue, Prop } from "vue-property-decorator";
import { TKSubmissionVisualizerOptions } from "../TKSubmissionVisualizer";
import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
import "jspdf-autotable";

import { TKComputeExportFilename } from "@/domain/export/TKExportCommon";
import TKSubmissionToPDFHeader from "./TKSubmissionToPDFHeader.vue";
import TKSubmissionToPDFHeadlines from "./TKSubmissionToPDFHeadlines.vue";
import TKSubmissionToPDFIndicators from "./TKSubmissionToPDFIndicators.vue";
import {
  TKFDFThematic,
  TKTFDFhematicsCollection
} from "@/domain/fdf/TKFDFThematics";

@Component({
  components: {
    TKSubmissionToPDFHeader,
    TKSubmissionToPDFHeadlines,
    TKSubmissionToPDFIndicators
  }
})
export default class TKSubmissionToPDF extends Vue {
  @Prop()
  readonly visualizerOptions!: TKSubmissionVisualizerOptions;

  @Prop()
  readonly dataset!: TKDatasetFilterer;

  @Prop()
  readonly appConfig!: TKOpsmapConfiguration;

  thematics!: TKTFDFhematicsCollection;
  them!: TKFDFThematic;

  mounted() {
    this.exportToPDF();
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // EXPORT TO PDF
  // ////////////////////////////////////////////////////////////////////////////////////////////////
  exportToPDF() {
    if (
      this.appConfig &&
      this.dataset &&
      this.dataset.currentCamp &&
      this.dataset.currentSubmission
    ) {
      console.log(this.dataset.currentSubmission?.thematics);

      const documentTitle = TKComputeExportFilename(this.dataset, "pdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      this.$nextTick(function() {
        const divContent = this.$refs["pdf-document"] as HTMLElement;
        pdf
          .html(divContent, {
            x: 0,
            y: 0,
            html2canvas: { scale: 0.75 }
          })
          .then(() => {
            // autoTable(pdf, {
            //   html: "#thematic",
            //   startY: 375
            // });
            pdf.save(documentTitle);
          });
      });
    }
  }
}
</script>

<style scoped>
/* A4 = 8.27x11.69" x 72points/inch = 595x842 points */
/* 595x842 points */
.pdf-document {
  background-color: #fff;
  padding: 5mm;
  width: 210mm;
}

.pdf-document-content {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  row-gap: 3mm;
  overflow: hidden;
}

.pdf-document-container {
  display: flex;
  flex-flow: column nowrap;
  row-gap: 0;
  width: 210mm;
  min-height: 296mm; /* Exact 297mm creates an extra blank page. */
}

/* SEPARATOR *********************************************************/
.header-separator {
  /* height: 0.1pt;
            border: 0;
            box-shadow: inset 0 0.1pt 0.1pt -0.1pt #428fdf88; */
  border: 0;
  height: 0;
  border-top: 1px solid #428fdf22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

/* THEMATIC **********************************************************/
.thematic {
  background-color: crimson;
  height: 15cm;
}

/* CONTENT ***********************************************************/
.content {
  background-color: azure;
  width: 100%;
  height: 50mm;
}
.footer {
  background-color: bisque;
  width: 100%;
  height: 50mm;
}
</style>
