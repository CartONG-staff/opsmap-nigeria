import { TKFDFChartsConfiguration } from "@/domain/fdf/TKFDFCharts/TKFDFChartsConfiguration";

// ////////////////////////////////////////////////////////////////////////////
// Read Chart Configuration json
// ////////////////////////////////////////////////////////////////////////////

export async function TKFDFReadCharts(
  file: string
): Promise<TKFDFChartsConfiguration> {
  const json: TKFDFChartsConfiguration = await fetch(file, {
    cache: "no-store"
  }).then(response => response.json());

  // ////////////////////////////////////////////////////////////////////////////
  // Check errors in the file
  // ////////////////////////////////////////////////////////////////////////////

  if (!json.charts) {
    json.charts = {};
    console.warn("[FDF] The Charts field is missing in the json.");
  }

  return json;
}
