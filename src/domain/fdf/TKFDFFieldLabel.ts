/* eslint-disable @typescript-eslint/camelcase */

export interface TKFDFFieldLabel {
  field_name: string;
  field_label_en: string;
  field_label_pt?: string;
};
export interface TKFDFFieldLabelCollection {
  [propName: string]: TKLabel;
}

// ////////////////////////////////////////////////////////////////////////////
// Read from infos
// ////////////////////////////////////////////////////////////////////////////

import { TKFDFInfos } from "@/domain/fdf/TKFDF";
import { TKLabel } from "@/domain/core/TKLabel";
import { TKCSVRead } from "@/domain/csv/TKCSVReader";

export async function TKReadFDFLabelsCollection(
  infos: TKFDFInfos
): Promise<TKFDFFieldLabelCollection> {

  const rawFieldsLabels: TKFDFFieldLabel[] = await TKCSVRead(
    "field_labels",
    infos.folder,
    true
  );

  const labelsCollection: TKFDFFieldLabelCollection = {};
  rawFieldsLabels.map((item: TKFDFFieldLabel) => {
    labelsCollection[ item.field_name] = {
      name: item.field_name,
      label_en: item.field_label_en,
      label_pt: item.field_label_pt
    };
  });
  return labelsCollection;
}