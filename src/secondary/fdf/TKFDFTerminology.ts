// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////

import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";
import { TKFDFTerminologyCollection } from "@/domain/fdf/TKFDFTerminology";
import { TKCSVParse } from "@/secondary/csv/TKCSV";
import { TKFDFFiles } from "./TKFDFFiles";

type TKFDFTerminologyRaw = Array<string>;

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the Thematic collection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFTerminologyCollection(
  infos: TKFDFInfos
): Promise<TKFDFTerminologyCollection> {
  const rawUrl: TKFDFTerminologyRaw[] = await TKCSVParse<TKFDFTerminologyRaw[]>(
    `${process.env.VUE_APP_GENERAL_CONFIG_DIRECTORY}${infos.folder}/${TKFDFFiles.TERMINOLOGY}.csv`,
    false
  );

  // Parse all the other lines: fill matching label with proper column indexes.
  const terminologyCollection: TKFDFTerminologyCollection = {};
  for (const el of rawUrl) {
    if (el[0] && el[1]) {
      terminologyCollection[el[0]] = el[1];
    }
  }

  return terminologyCollection;
}
