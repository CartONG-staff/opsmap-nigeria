import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKLabel } from "@/domain//ui/TKLabel";
import { TKFDFInfos } from "./TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Definition of the Answer label object
// The fields are the one described in the fdf file
// ////////////////////////////////////////////////////////////////////////////

export type TKFDFLabelRaw = Array<string>;
export type TKFDFLabelCollection = Record<string, TKLabel>;

// ////////////////////////////////////////////////////////////////////////////
// Method that creates the AnswerLabel object from the fdf folder
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFLabelCollection(
  file: string,
  infos: TKFDFInfos
): Promise<TKFDFLabelCollection> {
  const rawLabels: TKFDFLabelRaw[] = await TKCSVRead(file, infos.folder, false);

  // Parse header to find out coumn - language correspondance
  const header: string[] = Object.values(rawLabels[0]);

  const localesValuesForIndexes: string[] = ["ignore"]; // ignore first col --> choice name
  for (let i = 1; i < header.length; i++) {
    const split = header[i].split("_");
    const lang = split[split.length - 1] ?? "";
    localesValuesForIndexes.push(lang);
  }

  // Parse all the other lines: fill matching label with proper column indexes.
  const labelsCollection: TKFDFLabelCollection = {};

  for (let i = 1; i < rawLabels.length; i++) {
    const answer = rawLabels[i];
    labelsCollection[answer[0]] = {};

    for (let j = 1; j < answer.length; j++) {
      labelsCollection[answer[0]][localesValuesForIndexes[j]] = answer[j];
    }
  }

  return labelsCollection;
}
