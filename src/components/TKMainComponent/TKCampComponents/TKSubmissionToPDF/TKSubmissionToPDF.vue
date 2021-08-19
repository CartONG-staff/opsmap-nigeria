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
import autoTable, {
  MarginPaddingInput,
  RowInput,
  UserOptions
} from "jspdf-autotable";

import { TKComputeExportFilename } from "@/domain/export/TKExportCommon";
import TKSubmissionToPDFHeader from "./TKSubmissionToPDFHeader.vue";
import TKSubmissionToPDFHeadlines from "./TKSubmissionToPDFHeadlines.vue";
import TKSubmissionToPDFIndicators from "./TKSubmissionToPDFIndicators.vue";

import { TKGetLocalValue } from "@/domain/ui/TKLabel";
import { TKIconUrl } from "@/domain/ui/TKIcons";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import { TKTrafficLightValues } from "@/domain/fdf/TKTrafficLightValues";

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
            const margins = [
              { left: 15, right: 401 },
              { left: 208, right: 208 },
              { left: 401, right: 15 }
            ];

            const nonAutotableContentHeight = 265;
            const drawPosition: Array<{
              startY: number;
              pageNumber: number;
            }> = [
              {
                startY: nonAutotableContentHeight,
                pageNumber: (pdf.internal as any).getNumberOfPages()
              },
              {
                startY: nonAutotableContentHeight,
                pageNumber: (pdf.internal as any).getNumberOfPages()
              },
              {
                startY: nonAutotableContentHeight,
                pageNumber: (pdf.internal as any).getNumberOfPages()
              }
            ];

            let indexColumn = 0;
            // Draw FIRST RANGE OF COLUMN
            for (const key in submission.thematics) {
              const thematic = submission.thematics[key];
              const p = drawPosition[indexColumn];
              console.log(thematic.nameLabel.en);
              console.log(p);
              pdf.setPage(p.pageNumber);

              const pageNumberBefore = (pdf.internal as any).getNumberOfPages();
              autoTable(
                pdf,
                this.createTable(pdf, p.startY, margins[indexColumn], thematic)
              );
              const pageNumberAfter = (pdf.internal as any).getNumberOfPages();

              if (pageNumberAfter !== pageNumberBefore) {
                p.pageNumber = pageNumberAfter;
              }

              p.startY = (pdf as any).lastAutoTable.finalY + 15;
              indexColumn++;
              if (indexColumn > 2) {
                indexColumn = 0;
              }
            }
            pdf.save(documentTitle);
          });
      });
    }
  }

  createTable(
    pdf: jsPDF,
    startY: number,
    margins: MarginPaddingInput,
    thematic: TKSubmissionThematic
  ): UserOptions {
    const thematicHeaderImageURL = TKIconUrl(thematic.iconFileName);
    const thematicDataHeader = [
      {
        key: TKGetLocalValue(thematic.nameLabel, this.$i18n.locale),
        value: ""
      }
    ];
    const thematicDataBody = thematic.data.map(item => {
      if (item.type === "text") {
        return {
          key: TKGetLocalValue(item.fieldLabel, this.$i18n.locale),
          value: TKGetLocalValue(item.answerLabel, this.$i18n.locale),
          trafficLightColor: item.trafficLightColor
        };
      }
      return {
        key: "-",
        value: "-",
        trafficLightColor: false
      };
    });
    thematicDataBody.push(...thematicDataBody);

    const thematicHeadMargins = 10;
    const cellFontSize = 9;
    return {
      head: thematicDataHeader,
      body: thematicDataBody as RowInput[], // Remove warning
      startY: startY,
      margin: margins,
      columnStyles: {
        key: { halign: "left", fontSize: cellFontSize },
        value: { halign: "right", fontSize: cellFontSize, fontStyle: "bold" }
      },
      headStyles: {
        fillColor: "#f1f3f3",
        fontStyle: "bold",
        textColor: "#428fdf",
        minCellHeight: 4 * thematicHeadMargins,
        valign: "middle"
      },
      alternateRowStyles: {
        fillColor: "#F9F9F9"
      },

      // margin: { left: 15, right: 15, top: 15, bottom: 15 },

      // Use for changing styles with jspdf functions or customize the positioning of cells or cell text
      // just before they are drawn to the page.
      willDrawCell: function(data) {
        if (data.row.section === "head") {
          if (data.column.dataKey === "key") {
            data.cell.styles.cellPadding = {
              left: 5 * thematicHeadMargins
            };
            data.cell.width = 179;
          } else if (data.column.dataKey === "value") {
            data.cell.width = 0;
          }
        } else if (data.row.section === "body") {
          if (data.column.dataKey === "value") {
            switch ((data.row.raw as any).trafficLightColor) {
              case TKTrafficLightValues.OK:
                pdf.setTextColor(21, 120, 21);
                break;
              case TKTrafficLightValues.WARNING:
                pdf.setTextColor(255, 204, 0);
                break;
              case TKTrafficLightValues.DANGER:
                pdf.setTextColor(204, 112, 0);
                break;
              case TKTrafficLightValues.CRITICAL:
                pdf.setTextColor(204, 10, 0);
                break;
            }
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
