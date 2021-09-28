// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////

import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";
import { TKFDFTerminologyCollection } from "@/domain/fdf/TKFDFTerminology";
import { TKCSVParse } from "@/domain/utils/TKCSV";
import { TKFDFFiles } from "./TKFDFInfos";

type TKFDFTerminologyRaw = Array<string>;

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the Thematic collection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFTerminologyCollection(
  infos: TKFDFInfos
): Promise<TKFDFTerminologyCollection> {
  const rawUrl: TKFDFTerminologyRaw[] = await TKCSVParse<TKFDFTerminologyRaw[]>(
    TKFDFFiles.TERMINOLOGY,
    infos.folder,
    false
  );

  // Parse all the other lines: fill matching label with proper column indexes.
  const terminologyCollection: TKFDFTerminologyCollection = {};
  rawUrl.forEach(el => {
    if (el[0] && el[1]) {
      terminologyCollection[el[0]] = el[1];
    }
  });

  return terminologyCollection;
}
