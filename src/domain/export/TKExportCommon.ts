import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";

// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeExportFileBasename(dataset: TKDatasetFilterer): string {
  if (dataset) {
    const campId = dataset.currentCamp?.id ?? "";
    const campName = dataset.currentCamp?.name ?? "";
    const submissionId = dataset.currentDate.replaceAll("/", "-");

    const filename = campId + "_" + campName + "_" + submissionId;

    return filename;
  }
  return "camp-export";
}

export function TKComputeExportFilename(
  dataset: TKDatasetFilterer,
  extension: string
): string {
  let name = computeExportFileBasename(dataset);
  if (extension) {
    name += `.${extension}`;
  }
  return name;
}
