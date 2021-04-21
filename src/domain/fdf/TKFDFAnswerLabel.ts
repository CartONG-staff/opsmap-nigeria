import { TKCSVRead } from "../csv/TKCSVReader";
import { TKCSVSurveyInfo } from "../csv/TKCSVTypes";
import { TKKoboSurveyInfo } from "../kobo/TKKoboSurveyInfo";

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
  survey: TKKoboSurveyInfo | TKCSVSurveyInfo
): Promise<TKFDFAnswerLabelCollection> {

  const rawAnswerLabels: TKFDFAnswerLabel[] = await TKCSVRead(
    "answer_labels",
    survey.fdfFolder,
    true
  );

  const labelsCollection: TKFDFAnswerLabelCollection = {};
  rawAnswerLabels.map((item: TKFDFAnswerLabel) => {
    labelsCollection[item.choice_name] = { ...item };
  });
  return labelsCollection;
}


