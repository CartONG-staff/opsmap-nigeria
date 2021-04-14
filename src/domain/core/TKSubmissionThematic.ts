import { TKSubmissionItem, isAnswered } from "./TKSubmissionItem";

export interface TKSubmissionThematic {
    data: Array<TKSubmissionItem>;
    formatted_name: string;
    icon_file_name: string;
    thematic_label_en: string;
    thematic_label_pt?: string;
}

export function filterThematicUnanswered(thematic: TKSubmissionThematic){
    thematic.data = thematic.data.filter(
        (item: TKSubmissionItem) => isAnswered(item)
    );
}