/* eslint-disable @typescript-eslint/camelcase */

import { TKLabel } from "@/domain/core/TKLabel";

export interface TKFieldLabelCSV {
  field_name: string;
  field_label_en: string;
  field_label_pt?: string;
};

export function TKToLabel(item: TKFieldLabelCSV) : TKLabel{
  return {
    name: item.field_name,
    label_en: item.field_label_en,
    label_pt: item.field_label_pt
  }
}