import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKComputeExportFilename } from "./TKExportCommon";

import { jsPDF, jsPDFOptions } from "jspdf";

// ////////////////////////////////////////////////////////////////////////////
// Temaplted Read method for csv inputs
// ////////////////////////////////////////////////////////////////////////////

export function TKPDFWrite(dataset: TKDatasetFilterer, locale: string) {
  if (dataset.currentSubmission) {
    const documentTitle = TKComputeExportFilename(dataset, "pdf");
    const pdfContent = "";

    const doc = new jsPDF();
    doc.save(documentTitle);

    //computeCSVContent(dataset.currentSubmission, locale);
    // const encodedUri = encodeURI(pdfContent);
    // const link = document.createElement("a");
    // link.setAttribute("href", encodedUri);
    // link.setAttribute("download", documentTitle); // filename
    // document.body.appendChild(link); // Required for FF ?
    // link.click();
  }
}
