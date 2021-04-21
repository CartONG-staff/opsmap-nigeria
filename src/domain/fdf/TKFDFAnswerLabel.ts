import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKFDFInfos } from "@/domain/fdf/TKFDF";

/* eslint-disable @typescript-eslint/camelcase */
export interface TKFDFAnswerLabel {
    choice_name: string;
    choice_label_en: string;
    choice_label_pt?: string;
}

export interface TKFDFAnswerLabelCollection {
  [propName: string]: TKFDFAnswerLabel;
}

export async function TKReadFDFAnswerLabelCollection(
  infos: TKFDFInfos
): Promise<TKFDFAnswerLabelCollection> {

  const rawAnswerLabels: TKFDFAnswerLabel[] = await TKCSVRead(
    "answer_labels",
    infos.folder,
    true
  );

  const labelsCollection: TKFDFAnswerLabelCollection = {};
  rawAnswerLabels.map((item: TKFDFAnswerLabel) => {
    labelsCollection[item.choice_name] = { ...item };
  });
  return labelsCollection;
}


