export interface TKFDFThematic {
  formatted_name: string;
  icon_file_name: string;
  thematic_label_en: string;
  thematic_label_pt: string;
}

export interface TKTFDFhematicsCollection {
  [propName: string]: TKFDFThematic;
}

// ////////////////////////////////////////////////////////////////////////////
// Read from infos
// ////////////////////////////////////////////////////////////////////////////

import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKFDFInfos } from "@/domain/fdf/TKFDF";


export async function TKReadFDFThematicsCollection(infos: TKFDFInfos) : Promise<TKTFDFhematicsCollection>{

  const rawThematics: TKFDFThematic[] = await TKCSVRead<TKFDFThematic[]>(
    "thematic_config",
    infos.folder,
    true
  );

  const thematicsCollection: TKTFDFhematicsCollection = {};
  rawThematics.map((item: TKFDFThematic) => {
    thematicsCollection[item.formatted_name] = { ...item };
  });
  return thematicsCollection;
}
