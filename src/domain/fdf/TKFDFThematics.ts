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
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";


export async function TKReadFDFThematicsCollection(infos: TKFDFInfos) : Promise<TKTFDFhematicsCollection>{

  const rawThematics: TKFDFThematic[] = await TKCSVRead<TKFDFThematic[]>(
    TKFDFFiles.THEMATICS,
    infos.folder,
    true
  );

  const thematicsCollection: TKTFDFhematicsCollection = {};
  rawThematics.map((item: TKFDFThematic) => {
    thematicsCollection[item.formatted_name] = { ...item };
  });
  return thematicsCollection;
}
