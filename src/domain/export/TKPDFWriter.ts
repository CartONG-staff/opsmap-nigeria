import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";
import { TKComputeExportFilename } from "./TKExportCommon";

// ////////////////////////////////////////////////////////////////////////////
// Temaplted Read method for csv inputs
// ////////////////////////////////////////////////////////////////////////////

export function TKPDFWrite(dataset: TKDatasetFilterer, locale: string) {
  if (dataset.currentSubmission) {
    const pdfContent = "";
    //computeCSVContent(dataset.currentSubmission, locale);
    const encodedUri = encodeURI(pdfContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", TKComputeExportFilename(dataset, "pdf")); // filename
    document.body.appendChild(link); // Required for FF ?
    link.click();
  }
}
