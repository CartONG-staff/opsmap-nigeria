import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKLabel } from "../ui/TKLabel";
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Thematic datatype
// ////////////////////////////////////////////////////////////////////////////

interface TKFDFThematicRaw {
  formatted_name: string;
  icon_file_name: string;
  thematic_label_en: string;
  thematic_label_pt: string;
}

export interface TKFDFThematic {
  formattedName: string;
  iconFileName: string;
  thematicLabel: TKLabel;
}

export interface TKTFDFhematicsCollection {
  [propName: string]: TKFDFThematic;
}

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the Thematic collection object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFThematicsCollection(
  infos: TKFDFInfos
): Promise<TKTFDFhematicsCollection> {
  const rawThematics: TKFDFThematicRaw[] = await TKCSVRead<TKFDFThematicRaw[]>(
    TKFDFFiles.THEMATICS,
    infos.folder,
    true
  );

  const thematicsCollection: TKTFDFhematicsCollection = {};
  rawThematics.map((item: TKFDFThematicRaw) => {
    thematicsCollection[item.formatted_name] = {
      formattedName: item.formatted_name,
      iconFileName: item.icon_file_name,
      thematicLabel: {
        name: item.thematic_label_en,
        labelEn: item.thematic_label_en,
        labelPt: item.thematic_label_pt
      }
    };
  });
  return thematicsCollection;
}
