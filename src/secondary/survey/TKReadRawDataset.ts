import {
  TKSurveyInfos,
  TKSurveyInfosType
} from "@/domain/opsmapConfig/TKSurveyInfos";
import { TKCSVParse } from "@/secondary/csv/TKCSV";
import { TKGetKoboRawData } from "@/secondary/kobo/TKGetKoboRawData";
import { TKGetRidlRawData } from "@/secondary/ridl/TKGetRidlRawData";
import { ArcgisServerDatasetGetter } from "../arcgis/TKArcgisServerDatasetGetter";

export async function TKReadRawDataset(info: TKSurveyInfos) {
  switch (info.type) {
    case TKSurveyInfosType.CSV:
      return TKCSVParse(`${info.submissionsLocalUrl}`, true);
    case TKSurveyInfosType.GSHEET:
      return TKCSVParse(info.submissionsUrl, true);
    case TKSurveyInfosType.KOBO:
      return TKGetKoboRawData(info);
    case TKSurveyInfosType.RIDL:
      return TKGetRidlRawData(info.submissionsUrl);
    case TKSurveyInfosType.ARCGIS_SERVER:
      return new ArcgisServerDatasetGetter(info.dataServiceNumber, info.fieldMappingServiceNumber).getData();
  }
}
