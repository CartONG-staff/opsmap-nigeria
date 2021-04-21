/* eslint-disable @typescript-eslint/camelcase */

import { TKFDFAnswerLabel } from "@/domain/fdf/TKFDFAnswerLabel";

export interface TKLabel {
    name: string;
    label_en: string;
    label_pt?: string;
}

export function TKGetLocalValue(label: TKLabel, locale: string) : string {
    if(locale === 'pt'){
        return label.label_pt ? label.label_pt : label.label_en;
    }
    return label.label_en;
}


export function TKAnswerLabelToFieldLabel(answer: TKFDFAnswerLabel) : TKLabel {
    return {
        name: answer.choice_name,
        label_en: answer.choice_label_en,
        label_pt: answer.choice_label_pt};
}

// field_name: string;
// field_label_en: string;
// field_label_pt?: string;