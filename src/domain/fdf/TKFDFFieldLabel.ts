/* eslint-disable @typescript-eslint/camelcase */

import { TKCSVRead } from "@/domain/csv/TKCSVReader";
import { TKFDFFiles, TKFDFInfos } from "./TKFDFInfos";
import { TKLabel } from "@/domain/ui/TKLabel";

// ////////////////////////////////////////////////////////////////////////////
// Definition of the Field label object
// The fields are the one described in the fdf file
// ////////////////////////////////////////////////////////////////////////////
export interface TKFDFFieldLabel {
  field_name: string;
  field_label_en: string;
  field_label_pt?: string;
}
export interface TKFDFLabelCollection {
  [propName: string]: TKLabel;
}

// ////////////////////////////////////////////////////////////////////////////
// Read from infos
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadFDFLabelsCollection(
  infos: TKFDFInfos
): Promise<TKFDFLabelCollection> {
  const rawFieldsLabels: TKFDFFieldLabel[] = await TKCSVRead(
    TKFDFFiles.FIELDS,
    infos.folder,
    true
  );

  const labelsCollection: TKFDFLabelCollection = {};
  rawFieldsLabels.map((item: TKFDFFieldLabel) => {
    labelsCollection[item.field_name] = {
      name: item.field_name,
      label_en: item.field_label_en,
      label_pt: item.field_label_pt
    };
  });
  return labelsCollection;
}
