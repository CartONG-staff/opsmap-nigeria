/* eslint-disable @typescript-eslint/camelcase */

import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Definition of the Answer label object
// The fields are the one described in the fdf file
// ////////////////////////////////////////////////////////////////////////////

export interface TKFDFAnswerLabel {
  choice_name: string;
  choice_label_en: string;
  choice_label_pt?: string;
}

export interface TKFDFAnswerLabelCollection {
  [propName: string]: TKFDFAnswerLabel;
}

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the AnswerLabel object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFAnswerLabelCollection(
  infos: TKFDFInfos
): Promise<TKFDFAnswerLabelCollection> {
  const rawAnswerLabels: TKFDFAnswerLabel[] = await TKCSVRead(
    TKFDFFiles.ANSWERS,
    infos.folder,
    true
  );

  const labelsCollection: TKFDFAnswerLabelCollection = {};

  rawAnswerLabels.map((item: TKFDFAnswerLabel) => {
    labelsCollection[item.choice_name] = { ...item };
  });

  return labelsCollection;
}
