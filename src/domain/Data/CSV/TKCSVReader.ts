import { parse } from "papaparse";
import { TKCategory } from "@/domain/Data/Survey/TKCategoriesCollectionBuilder";
import { TKLabel } from "@/domain/Data/Survey/TKLabelsCollectionBuilder";
import { TKTrafficLightsRaw } from "@/domain/Data/Survey/TKTrafficLightsCollectionBuilder";

export async function TKCSVReader<T>(
  name: string,
  folder: string,
  header: boolean
): Promise<T> {
  return new Promise((resolve, reject) => {
    parse(`./data/${folder}/${name}.csv`, {
      header: header,
      download: true,
      complete(results: any) {
        resolve(results.data);
      },
      error(err) {
        reject(err);
      },
    });
  });
}
