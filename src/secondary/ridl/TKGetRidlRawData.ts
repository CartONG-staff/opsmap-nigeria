import { TKFDFLabelCollection } from "@/domain/fdf/TKFDFParseMultiLang";
import { ParseConfig, parse } from "papaparse";

import { read, utils } from "xlsx";

// ////////////////////////////////////////////////////////////////////////////
// Retrieve raw data from kobo
// ////////////////////////////////////////////////////////////////////////////

export async function TKGetRidlRawData(url: string) {
  try {
    const file = `${url}`;
    const f = await (
      await fetch(file, {
        method: "get",
        headers: new Headers({
          Authorization: `${process.env.VUE_APP_RIDL_TOKEN}`
        })
      })
    ).arrayBuffer();
    const wb = read(f);
    const parseConfig: ParseConfig = {
      header: true,
      skipEmptyLines: true
    };
    const dataParsed = parse(
      utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]),
      parseConfig
    );
    return dataParsed.data;
  } catch (error) {
    console.error(error);
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Retrieve raw data from kobo
// ////////////////////////////////////////////////////////////////////////////

export async function TKGetRidlTranslationsData(url: string) {
  const data = await TKGetRidlRawData(url);

  // Parse xslx content
  const labelsCollection: TKFDFLabelCollection = {};
  for (const entry of data as Array<Record<string, string>>) {
    labelsCollection[entry["choice_name"]] = {};
    for (const localKey of Object.keys(entry).filter(key =>
      key.startsWith("choice_label_")
    )) {
      labelsCollection[entry["choice_name"]][
        localKey.replace("choice_label_", "")
      ] = entry[localKey];
    }
  }
  return labelsCollection;
}
