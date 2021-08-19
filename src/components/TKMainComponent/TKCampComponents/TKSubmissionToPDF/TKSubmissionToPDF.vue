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
let GRAPHASIMAGE64 = "";

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
        if (item.type === "age_pyramid") {
          GRAPHASIMAGE64 = item.base64;
          const props = pdf.getImageProperties(item.base64);
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
