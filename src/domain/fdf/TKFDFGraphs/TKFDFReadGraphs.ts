import { TKFDFGraphsConfiguration } from "@/domain/fdf/TKFDFGraphs/TKFDFGraphsConfiguration";

// ////////////////////////////////////////////////////////////////////////////
// Read Graph Configuration json
// ////////////////////////////////////////////////////////////////////////////

export async function TKFDFReadGraphs(
  file: string
): Promise<TKFDFGraphsConfiguration> {
  const json: TKFDFGraphsConfiguration = await fetch(file, {
    cache: "no-store"
  }).then(response => response.json());

  // ////////////////////////////////////////////////////////////////////////////
  // Check errors in the file
  // ////////////////////////////////////////////////////////////////////////////

  if (!json.graphs) {
    json.graphs = {};
    console.warn("[FDF] The Graphs field is missing in the json.");
  }

  return json;
}
