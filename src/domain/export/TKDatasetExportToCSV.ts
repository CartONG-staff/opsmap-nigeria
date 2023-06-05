import { TKDataset } from "@/domain/survey/TKDataset";
import {
  TKCSVWrite,
  TKCSVWriteCurrentSelection
} from "@/secondary/export/TKCSVWriter";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";

// ////////////////////////////////////////////////////////////////////////////
// Helper methods
// ////////////////////////////////////////////////////////////////////////////

function computeSiteExportFileBasename(dataset: TKDataset): string {
  if (dataset) {
    const siteId = dataset.currentSite?.id ?? "";
    const siteName = dataset.currentSite?.name ?? "";
    const submissionId = dataset.currentSubmission?.date.replaceAll("/", "-");

    const filename = siteId + "_" + siteName + "_" + submissionId;

    return filename;
  }
  return "site-export";
}

function computeSelectionExportFileBasename(dataset: TKDataset): string {
  if (dataset) {
    let filename = "export";
    filename += TKConfigurationModule.configuration.spatial.adminLevels.map(
      level => {
        const admin = dataset.getCurrentAdmin(level);
        if (admin) {
          return "_" + admin.name;
        } else return "";
      }
    );

    if (dataset.currentSite) {
      filename += "_" + dataset.currentSite.name;
    }

    return filename;
  }
  return "selection-export";
}

export function TKComputeSiteExportFilename(
  dataset: TKDataset,
  extension: string
): string {
  let name = computeSiteExportFileBasename(dataset);
  if (extension) {
    name += `.${extension}`;
  }
  return name;
}

export function TKComputeSelectionExportFilename(
  dataset: TKDataset,
  extension: string
): string {
  let name = computeSelectionExportFileBasename(dataset);
  if (extension) {
    name += `.${extension}`;
  }
  return name;
}

// ////////////////////////////////////////////////////////////////////////////
// Write CSV file
// ////////////////////////////////////////////////////////////////////////////

export function TKDatasetExportCurrentSiteToCSV(
  dataset: TKDataset,
  locale: string
) {
  TKCSVWrite(dataset, TKComputeSiteExportFilename(dataset, "csv"), locale);
}

// ////////////////////////////////////////////////////////////////////////////
// Write CSV file
// ////////////////////////////////////////////////////////////////////////////

export function TKDatasetExportCurrentSelectionToCSV(
  dataset: TKDataset,
  locale: string
) {
  TKCSVWriteCurrentSelection(
    dataset,
    TKComputeSelectionExportFilename(dataset, "csv"),
    locale
  );
}
