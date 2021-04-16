/* eslint-disable @typescript-eslint/camelcase */

import { TKAnswerLabel } from "./TKAnswerLabel";

export interface TKFieldLabel {
    field_name: string;
    field_label_en: string;
    field_label_pt?: string;
}

export function TKGetLocalValue(label: TKFieldLabel, locale: string) : string {
    if(locale === 'pt'){
        return label.field_label_pt ? label.field_label_pt : label.field_label_en;
    }
    return label.field_label_en;
}


export function TKAnswerLabelToFieldLabel(answer: TKAnswerLabel) : TKFieldLabel {
    return {
        field_name: answer.choice_name,
        field_label_en: answer.choice_label_en,
        field_label_pt: answer.choice_label_pt};
}