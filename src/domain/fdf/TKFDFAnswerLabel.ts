/* eslint-disable @typescript-eslint/camelcase */

import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKLabel } from "../ui/TKLabel";
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
  [propName: string]: TKLabel;
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
    labelsCollection[item.choice_name] = {
      name: item.choice_name,
      label_en: item.choice_label_en,
      label_pt: item.choice_label_pt};
  });

  return labelsCollection;
}
