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

const GRAPHASIMAGE64 =
  "data:image/png;base64,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";

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

            const nonAutotableContentHeight = 280;
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
            for (const key in submission.thematics) {
              const thematic = submission.thematics[key];

              const p = drawPosition[indexColumn];

              pdf.setPage(p.pageNumber);
              autoTable(
                pdf,
                this.createTable(pdf, p.startY, margins[indexColumn], thematic)
              );

              p.pageNumber =
                (pdf as any).lastAutoTable.startPageNumber +
                ((pdf as any).lastAutoTable.pageCount - 1);
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
    const headerHeight = 35;

    const iconURL = TKIconUrl(thematic.iconFileName);

    const iconProps = pdf.getImageProperties(iconURL);

    const iconContainerWidth = 35;
    const iconDisplayHeight = 15;

    const iconDisplayWidth =
      (iconProps.width / iconProps.height) * iconDisplayHeight;
    const iconDisplayX = iconContainerWidth / 2.0 - iconDisplayWidth / 2.0;
    const iconDisplayY = headerHeight / 2.0 - iconDisplayHeight / 2.0;

    const body = [];
    for (let i = 0; i < thematic.data.length; i++) {
      const item = thematic.data[i];
      if (item.type === "text") {
        let color = "#000000";
        switch (item.trafficLightColor) {
          case TKTrafficLightValues.OK:
            color = "#157815";
            break;
          case TKTrafficLightValues.WARNING:
            color = "#ffcc00";
            break;
          case TKTrafficLightValues.DANGER:
            color = "#cc7000";
            break;
          case TKTrafficLightValues.CRITICAL:
            color = "#cc0a00";
            break;
        }

        const row: RowInput = [];
        row.push({
          content: TKGetLocalValue(item.fieldLabel, this.$i18n.locale),
          styles: {
            halign: "left",
            fontSize: 9
          }
        });
        row.push({
          content: TKGetLocalValue(item.answerLabel, this.$i18n.locale),
          styles: {
            halign: "right",
            textColor: color,
            fontSize: 9,
            fontStyle: "bold"
          }
        });
        body.push(row);
      } else {
        const props = pdf.getImageProperties(GRAPHASIMAGE64);
        const maxWidth = 180;
        const width = props.width > maxWidth ? maxWidth : props.width;
        const height = (props.height / props.width) * width;

        const row: RowInput = [];
        row.push({
          content: "",
          colSpan: 2,
          styles: {
            minCellHeight: height
          }
        });
        body.push(row);
      }
    }

    return {
      // Content
      head: [
        [
          {
            content: TKGetLocalValue(thematic.nameLabel, this.$i18n.locale),
            colSpan: 2,
            styles: {
              valign: "middle",
              halign: "left",
              cellPadding: { left: iconContainerWidth },
              fillColor: "#f1f3f3",
              textColor: "#428fdf",
              minCellHeight: headerHeight,
              fontSize: 10
            }
          }
        ]
      ],
      body: body,

      // Position in the document
      startY: startY,
      margin: margins,

      // Style
      alternateRowStyles: {
        fillColor: "#F9F9F9"
      },

      // Thematic logo inside the header
      didDrawCell: function(data) {
        if (data.row.section === "head") {
          pdf.addImage(
            iconURL,
            "PNG",
            data.cell.x + iconDisplayX,
            data.cell.y + iconDisplayY,
            iconDisplayWidth,
            iconDisplayHeight
          );
        } else {
          if ((data.row.raw as RowInput).length === 1) {
            const props = pdf.getImageProperties(GRAPHASIMAGE64);
            const width =
              props.width > data.cell.width ? data.cell.width : props.width;
            const height = (props.height / props.width) * width;
            const x = (data.cell.width - width) / 2;
            const y = (data.cell.height - height) / 2;
            pdf.addImage(
              GRAPHASIMAGE64,
              "PNG",
              data.cell.x + x,
              data.cell.y + y,
              width,
              height
            );
          }
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
