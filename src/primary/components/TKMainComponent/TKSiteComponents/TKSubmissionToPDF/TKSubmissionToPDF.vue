<template>
  <div class="pdf-document-container">
    <div class="pdf-document" ref="pdf-document">
      <div
        class="pdf-document-content"
        :class="{ 'pdf-document-content--arabic': isLocaleArabic }"
        :dir="isLocaleArabic ? 'rtl' : 'ltr'"
      >
        <TKSubmissionToPDFHeadlines />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import jsPDF from "jspdf";
import autoTable, {
  CellDef,
  MarginPaddingInput,
  RowInput,
  UserOptions
} from "jspdf-autotable";

import TKSubmissionToPDFHeadlines from "./TKSubmissionToPDFHeadlines.vue";

import { TKGetLocalValue, TKLabel } from "@/domain/utils/TKLabel";
import { IconPosition, TKIconUrl } from "@/domain/utils/TKIconUrl";
import { TKSubmissionThematic } from "@/domain/survey/TKSubmissionThematic";
import { getColorFromValue } from "@/domain/fdf/TKFDFTrafficLight";
import { TKSubmissionEntryType } from "@/domain/survey/TKSubmissionEntry";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";
import TKPDFInfosModule from "@/store/modules/pdfinfos/TKPDFInfosModule";
import { TKColors } from "@/domain/utils/TKColors";
import {
  applyVisualizerOptions,
  getEntriesForThematic,
  TKSubmissionEntries
} from "@/domain/survey/TKSubmissionEntries";

import {
  AmiriBold,
  AmiriBoldItalic,
  AmiriItalic,
  AmiriNormal,
  RobotoBold,
  RobotoBoldItalic,
  RobotoItalic,
  RobotoNormal
} from "@/domain/fonts";

@Component({
  components: {
    TKSubmissionToPDFHeadlines
  }
})
export default class TKSubmissionToPDF extends Vue {
  mounted() {
    this.exportToPDF();
  }

  get isLocaleArabic() {
    return this.$i18n.locale === "ar";
  }

  get fontFromLocale() {
    return this.isLocaleArabic ? "Amiri" : "Roboto";
  }
  get alignmentFromLocale() {
    return this.isLocaleArabic ? "right" : "left";
  }

  generateName(): string {
    return `${TKDatasetModule.dataset.currentSite?.name} - ${TKDatasetModule.dataset.currentSubmission?.date}`;
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////
  // EXPORT TO PDF
  // ////////////////////////////////////////////////////////////////////////////////////////////////

  /* eslint-disable @typescript-eslint/no-explicit-any */
  exportToPDF() {
    if (
      TKDatasetModule.dataset &&
      TKDatasetModule.dataset.currentSite &&
      TKDatasetModule.dataset.currentSubmission
    ) {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true
      });

      if (this.isLocaleArabic) {
        pdf.addFileToVFS("Amiri-bolditalic.ttf", AmiriBoldItalic);
        pdf.addFont("Amiri-bolditalic.ttf", "Amiri", "bolditalic");
        pdf.addFileToVFS("Amiri-bold.ttf", AmiriBold);
        pdf.addFont("Amiri-bold.ttf", "Amiri", "bold");
        pdf.addFileToVFS("Amiri-italic.ttf", AmiriItalic);
        pdf.addFont("Amiri-italic.ttf", "Amiri", "italic");
        pdf.addFileToVFS("Amiri-normal.ttf", AmiriNormal);
        pdf.addFont("Amiri-normal.ttf", "Amiri", "normal");
      } else {
        pdf.addFileToVFS("Roboto-bolditalic.ttf", RobotoBoldItalic);
        pdf.addFont("Roboto-bolditalic.ttf", "Roboto", "bolditalic");
        pdf.addFileToVFS("Roboto-bold.ttf", RobotoBold);
        pdf.addFont("Roboto-bold.ttf", "Roboto", "bold");
        pdf.addFileToVFS("Roboto-italic.ttf", RobotoItalic);
        pdf.addFont("Roboto-italic.ttf", "Roboto", "italic");
        pdf.addFileToVFS("Roboto-normal.ttf", RobotoNormal);
        pdf.addFont("Roboto-normal.ttf", "Roboto", "normal");
      }

      ///
      const submission = TKDatasetModule.dataset.currentSubmission;

      this.$nextTick(function() {
        const divContent = this.$refs["pdf-document"] as HTMLElement;
        pdf
          .html(divContent, {
            x: 0,
            y: 0,
            html2canvas: { scale: 0.75 }
          })
          .then(() => {
            // PDF CONSTANTS
            const PAGE_WIDTH = 595;
            const SPACING = 10;
            const TOTAL_SPACING_COUNT = 2 + TKPDFInfosModule.columnCount - 1;
            const TOTAL_SPACING = TOTAL_SPACING_COUNT * SPACING;

            const COLUMN_WIDTH = Math.round(
              (PAGE_WIDTH - TOTAL_SPACING) / TKPDFInfosModule.columnCount
            );
            const NONAUTOTABLECONTENTHEIGHT = 130 + SPACING;

            const margins = [];
            for (let i = 0; i < TKPDFInfosModule.columnCount; i++) {
              margins.push({
                left: SPACING + (COLUMN_WIDTH + SPACING) * i,
                right:
                  PAGE_WIDTH -
                  COLUMN_WIDTH -
                  (SPACING + (COLUMN_WIDTH + SPACING) * i)
              });
            }

            const drawPosition: Array<{
              startY: number;
              pageNumber: number;
            }> = [];

            for (let i = 0; i < TKPDFInfosModule.columnCount; i++) {
              drawPosition.push({
                startY: NONAUTOTABLECONTENTHEIGHT,
                pageNumber: (pdf.internal as any).getNumberOfPages()
              });
            }

            let indexColumn = 0;
            for (const thematic of submission.thematics) {
              const p = drawPosition[indexColumn];

              pdf.setPage(p.pageNumber);
              autoTable(
                pdf,
                this.createTable(
                  pdf,
                  p.startY,
                  margins[indexColumn],
                  thematic,
                  submission.entries,
                  COLUMN_WIDTH
                )
              );

              p.pageNumber =
                (pdf as any).lastAutoTable.startPageNumber +
                ((pdf as any).lastAutoTable.pageCount - 1);
              p.startY = (pdf as any).lastAutoTable.finalY + 15;

              // Option 1 - Least Filled Column
              let min = drawPosition[0];
              indexColumn = 0;
              for (let i = 1; i < drawPosition.length; i++) {
                if (
                  drawPosition[i].pageNumber < min.pageNumber ||
                  (drawPosition[i].pageNumber === min.pageNumber &&
                    drawPosition[i].startY < min.startY)
                ) {
                  indexColumn = i;
                  min = drawPosition[i];
                }
              }

              // Option 2 - Round Robin
              // indexColumn++;
              // if (indexColumn === TKPDFInfosModule.columnCount) {
              //   indexColumn = 0;
              // }
            }
          })
          .then(() => {
            const pageCount = pdf.getNumberOfPages(); //Total Page Number
            for (let i = 0; i < pageCount; i++) {
              const pageCurrent = i + 1;
              pdf.setPage(i + 1);
              pdf.setFontSize(10);
              pdf.setTextColor(TKColors.DARK_GREY);
              pdf.text(
                pageCurrent + "/" + pageCount,
                pdf.internal.pageSize.width / 2 - 10,
                pdf.internal.pageSize.height - 10
              );
            }
          })
          .then(() => {
            pdf.save(this.generateName());
            this.$emit("close-dialog");
          });
      });
    }
  }

  getField(label: TKLabel): CellDef {
    return {
      content: TKGetLocalValue(label, this.$i18n.locale),
      styles: {
        halign: this.alignmentFromLocale,
        fontSize: 7,
        cellPadding: {
          top: 5
        }
      }
    };
  }

  getAnswer(answerLabel: TKLabel, color: TKColors): CellDef {
    return {
      content: TKGetLocalValue(answerLabel, this.$i18n.locale),
      styles: {
        halign: this.alignmentFromLocale,
        textColor: color,
        fontSize: 7,
        fontStyle: "bold",
        cellPadding: {
          left: 0,
          top: 2
        }
      }
    };
  }

  createTable(
    pdf: jsPDF,
    startY: number,
    margins: MarginPaddingInput,
    thematic: TKSubmissionThematic,
    entries: TKSubmissionEntries,
    columnWidth: number
  ): UserOptions {
    const headerHeight = 25;
    const iconURL = TKIconUrl(thematic.iconFileName, IconPosition.MAP);
    const iconProps = pdf.getImageProperties(iconURL);
    const iconContainerWidth = 35;
    const iconDisplayHeight = 10;
    const iconDisplayWidth =
      (iconProps.width / iconProps.height) * iconDisplayHeight;
    const iconDisplayX = iconContainerWidth / 2.0 - iconDisplayWidth / 2.0;
    const iconDisplayY = headerHeight / 2.0 - iconDisplayHeight / 2.0;
    const isLocaleArabic = this.isLocaleArabic;

    const body = [];

    const charts: Record<
      number,
      {
        base64: string;
        width: number;
        height: number;
      }
    > = {};
    const entriesForThematic = applyVisualizerOptions(
      getEntriesForThematic(entries, thematic)
    );

    for (const entry of entriesForThematic) {
      if (entry.type === TKSubmissionEntryType.TEXT) {
        const field = this.getField(entry.fieldLabel);
        body.push([field]);

        const color = getColorFromValue(entry.trafficLight);
        const answer = this.getAnswer(entry.answerLabel, color);
        body.push([answer]);
      } else if (entry.type === TKSubmissionEntryType.BULLET) {
        const field = this.getField(entry.fieldLabel);
        body.push([field]);

        const color = getColorFromValue(entry.trafficLight);
        for (const answerLabel of entry.answersLabels) {
          const answer = this.getAnswer(answerLabel, color);
          body.push([answer]);
        }
      } else if (
        entry.type === TKSubmissionEntryType.CHART_PYRAMID ||
        entry.type === TKSubmissionEntryType.CHART_DOUGHNUT ||
        entry.type === TKSubmissionEntryType.CHART_POLAR ||
        entry.type === TKSubmissionEntryType.CHART_RADAR
      ) {
        const props = pdf.getImageProperties(
          TKPDFInfosModule.currentChartsBase64[entry.chartid]
        );
        const maxWidth = Math.min(columnWidth - 20, 150);
        const width = props.width > maxWidth ? maxWidth : props.width;
        const height = (props.height / props.width) * width;

        const row: RowInput = [];
        row.push({
          content: "",
          styles: {
            minCellHeight: height
          }
        });
        const str = TKPDFInfosModule.currentChartsBase64[entry.chartid];
        charts[body.length] = {
          base64: str,
          width: width,
          height: height
        };

        body.push(row);
      }
    }

    return {
      // Content
      head: [
        [
          {
            content: TKGetLocalValue(thematic.nameLabel, this.$i18n.locale),
            styles: {
              valign: "middle",
              halign: this.alignmentFromLocale,
              cellPadding: this.isLocaleArabic
                ? { right: iconContainerWidth }
                : { left: iconContainerWidth },
              fillColor: TKColors.BACKGROUND,
              textColor: TKColors.DARK_GREY,
              lineColor: TKColors.DARK_GREY,
              lineWidth: 1,
              minCellHeight: headerHeight,
              fontSize: 8
            }
          }
        ]
      ],
      styles: { font: this.fontFromLocale },
      body: body,

      // Position in the document
      startY: startY,
      margin: margins,
      rowPageBreak: "avoid",

      // Style
      theme: "plain",

      didDrawCell: function(data) {
        // Thematic logo inside the header
        if (data.row.section === "head") {
          const iconDisplayStartX = isLocaleArabic
            ? data.cell.width - iconContainerWidth + iconDisplayX
            : iconDisplayX;
          pdf.addImage(
            iconURL,
            "PNG",
            data.cell.x + iconDisplayStartX,
            data.cell.y + iconDisplayY,
            iconDisplayWidth,
            iconDisplayHeight
          );
        }
        // Insert charts as png
        else {
          if ((data.row.raw as RowInput).length === 1) {
            if (charts[data.row.index]) {
              const width = charts[data.row.index].width;
              const height = charts[data.row.index].height;
              const x = (data.cell.width - width) / 2;
              const y = (data.cell.height - height) / 2;
              pdf.addImage(
                charts[data.row.index].base64,
                "PNG",
                data.cell.x + x,
                data.cell.y + y,
                width,
                height
              );
            }
          }
        }
      }
    };
  }
}
</script>

<style scoped>
.pdf-document-container {
  width: 0;
  height: 0;
  overflow: hidden;
}

/* A4 = 8.27x11.69" x 72points/inch = 595x842 points */
/* 595x842 points */
.pdf-document {
  background-color: #fff;
  padding: 5mm;
  width: 210mm;
  min-height: 296mm; /* Exact 297mm creates an extra blank page. */
}

.pdf-document-content {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  row-gap: 3mm;
  overflow: hidden;
  font-family: "Roboto";
}
.pdf-document-content--arabic {
  font-family: "Amiri";
}
</style>
