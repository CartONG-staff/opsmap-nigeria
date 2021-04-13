import { TKSubmissionItem } from "./TKSubmissionItem"
export interface TKSubmission {
    data: Array<TKSubmissionItem>;
    formatted_name: string;
    icon_file_name: string;
    thematic_label_en: string;
    thematic_label_pt?: string;
}

// TODO: a more flexible approach for language.