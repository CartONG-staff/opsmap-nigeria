<template>
  <div class="pdf-document-container">
    <div class="pdf-document" ref="pdf-document">
      <div class="pdf-document-content">
        <TKSubmissionToPDFHeader :appConfig="appConfig" />
        <div class="header-separator"></div>
        <TKSubmissionToPDFHeadlines :appConfig="appConfig" :dataset="dataset" />
        <TKSubmissionToPDFIndicators
          :appConfig="appConfig"
          :dataset="dataset"
        />
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
import autoTable, { UserOptions } from "jspdf-autotable";

import { TKComputeExportFilename } from "@/domain/export/TKExportCommon";
import TKSubmissionToPDFHeader from "./TKSubmissionToPDFHeader.vue";
import TKSubmissionToPDFHeadlines from "./TKSubmissionToPDFHeadlines.vue";
import TKSubmissionToPDFIndicators from "./TKSubmissionToPDFIndicators.vue";

import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";

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
      const documentTitle = TKComputeExportFilename(this.dataset, "pdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });
      const submission = this.dataset.currentSubmission;
      this.$nextTick(function() {
        const divContent = this.$refs["pdf-document"] as HTMLElement;
        pdf
          .html(divContent, {
            x: 0,
            y: 0,
            html2canvas: { scale: 0.75 }
          })
          .then(() => {
            autoTable(
              pdf,
              this.createTable(
                pdf,
                265,
                submission.thematics["group_infrastructure"]
              )
            );
            autoTable(
              pdf,
              this.createTable(
                pdf,
                (pdf as any).lastAutoTable.finalY + 10,
                submission.thematics["group_cccm"]
              )
            );
            pdf.save(documentTitle);
          });
      });
    }
  }

  createTable(
    pdf: jsPDF,
    startY: number,
    thematic: TKSubmissionThematic
  ): UserOptions {
    const thematicHeaderImageURL = TKIconUrl(thematic.iconFileName);
    const thematicDataHeader = [
      { key: TKGetLocalValue(thematic.nameLabel, this.$i18n.locale), value: "" }
    ];
    const thematicDataBody = thematic.data.map(item => {
      if (item.type === "text") {
        return {
          key: TKGetLocalValue(item.fieldLabel, this.$i18n.locale),
          value: TKGetLocalValue(item.answerLabel, this.$i18n.locale)
        };
      }
      return {
        key: "-",
        value: "-"
      };
    });
    thematicDataBody.push(...thematicDataBody);

    const thematicHeadMargins = 8;
    return {
      head: thematicDataHeader,
      body: thematicDataBody,
      startY: startY,
      headStyles: {
        fillColor: "#754514",
        minCellHeight: 4 * thematicHeadMargins,
        valign: "middle"
      },
      margin: { left: 15, right: 15 },

      // Use for changing styles with jspdf functions or customize the positioning of cells or cell text
      // just before they are drawn to the page.
      willDrawCell: function(data) {
        if (data.row.section === "head") {
          if (data.column.dataKey === "key") {
            data.cell.styles.cellPadding = {
              left: 4 * thematicHeadMargins
              // top: thematicHeadMargins
            };
          }
        }
      },
      // Use for adding content to the cells after they are drawn. This could be images or links.
      // You can also use this to draw other custom jspdf content to cells with doc.text or doc.rect
      // for example.
      didDrawCell: function(data) {
        if (data.row.section === "head" && data.column.dataKey === "key") {
          pdf.addImage(
            thematicHeaderImageURL,
            "PNG",
            data.cell.x + thematicHeadMargins,
            data.cell.y + thematicHeadMargins,
            2 * thematicHeadMargins,
            2 * thematicHeadMargins
          );
        }
      }
    };
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
  border: 0;
  height: 0;
  border-top: 1px solid #428fdf22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
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
