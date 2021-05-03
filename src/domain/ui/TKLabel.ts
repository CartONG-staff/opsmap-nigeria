export interface TKLabel {
  name: string;
  labelEn: string;
  labelPt?: string;
}

export function TKGetLocalValue(label: TKLabel, locale: string): string {
  if(label){
    if (locale === "pt") {
      return label.labelPt ? label.labelPt : label.labelEn;
    }
    return label.labelEn;
  }
  return "";
}

// field_name: string;
// field_label_en: string;
// field_label_pt?: string;
