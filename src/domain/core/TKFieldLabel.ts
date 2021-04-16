export interface TKFieldLabel {
    field_name: string;
    field_label_en: string;
    field_label_fr?: string;
    field_label_pt?: string;
}

export function TKGetLocalValue(label: TKFieldLabel, locale: string) : string {
    if(locale === 'pt'){
        return label.field_label_pt ? label.field_label_pt : label.field_label_en;
    }
    return label.field_label_en;
}