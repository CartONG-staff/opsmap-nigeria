import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKLabel } from "@/domain//ui/TKLabel";
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Definition of the Answer label object
// The fields are the one described in the fdf file
// ////////////////////////////////////////////////////////////////////////////

interface TKFDFAnswerLabelRaw {
  choice_name: string;
  choice_label_en: string;
  choice_label_pt?: string;
}

export interface TKFDFAnswerLabelCollection {
  [propName: string]: TKLabel;
}

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the AnswerLabel object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFAnswerLabelCollection(
  infos: TKFDFInfos
): Promise<TKFDFAnswerLabelCollection> {
  const rawAnswerLabels: TKFDFAnswerLabelRaw[] = await TKCSVRead(
    TKFDFFiles.ANSWERS,
    infos.folder,
    true
  );

  const labelsCollection: TKFDFAnswerLabelCollection = {};

  rawAnswerLabels.map((item: TKFDFAnswerLabelRaw) => {
    labelsCollection[item.choice_name] = {
      labelEn: item.choice_label_en,
      labelPt: item.choice_label_pt
    };
  });

  return labelsCollection;
}
