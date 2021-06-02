export interface TKLabel extends Record<string, string> {
  en: string;
}

export function TKGetLocalValue(label: TKLabel, locale: string): string {
  return label[locale] ?? label["en"] ?? "" ;
}

// field_name: string;
// field_label_en: string;
// field_label_pt?: string;
