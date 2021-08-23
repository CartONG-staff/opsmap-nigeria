import { TKDataset } from "@/domain/survey/TKDataset";

// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeExportFileBasename(dataset: TKDataset): string {
  if (dataset) {
    const campId = dataset.currentCamp?.infos.id ?? "";
    const campName = dataset.currentCamp?.infos.name ?? "";
    const submissionId = dataset.currentSubmission?.date.replaceAll("/", "-");

    const filename = campId + "_" + campName + "_" + submissionId;

    return filename;
  }
  return "camp-export";
}

export function TKComputeExportFilename(
  dataset: TKDataset,
  extension: string
): string {
  let name = computeExportFileBasename(dataset);
  if (extension) {
    name += `.${extension}`;
  }
  return name;
}
