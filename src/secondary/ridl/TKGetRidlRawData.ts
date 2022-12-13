import { TKSurveyInfosRidl } from "@/domain/opsmapConfig/TKSurveyInfos";
import { parse } from "papaparse";

import { read, utils } from "xlsx";

// ////////////////////////////////////////////////////////////////////////////
// Retrieve raw data from kobo
// ////////////////////////////////////////////////////////////////////////////

export async function TKGetRidlRawData(config: TKSurveyInfosRidl) {
  try {
    const file = `${config.url}`;
    const f = await (
      await fetch(file, {
        method: "get",
        headers: new Headers({
          Authorization: `${process.env.VUE_APP_RIDL_TOKEN}`
        })
      })
    ).arrayBuffer();
    const wb = read(f);
    const dataParsed = parse(utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]), {
      encoding: "utf-8",
      header: true,
      skipEmptyLines: true
    });
    return dataParsed.data;
  } catch (error) {
    console.error(error);
  }
}
