import { TKDataset } from "@/domain/survey/TKDataset";
import { TKComputeExportFilename } from "./TKExportCommon";

import { jsPDF, jsPDFOptions } from "jspdf";

// ////////////////////////////////////////////////////////////////////////////
// Temaplted Read method for csv inputs
// ////////////////////////////////////////////////////////////////////////////

export function TKPDFWrite(dataset: TKDataset, locale: string) {
  if (dataset.currentSubmission) {
    const documentTitle = TKComputeExportFilename(dataset, "pdf");

    const doc = new jsPDF();

    doc.save(documentTitle);
  }
}
