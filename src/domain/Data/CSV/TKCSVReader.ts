import { parse } from "papaparse";

export async function TKCSVReader(
  name: string,
  folder: string,
  header: boolean
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    parse(`./data/${folder}/${name}.csv`, {
      header: header,
      download: true,
      complete(results) {
        resolve(results.data);
      },
      error(err) {
        reject(err);
      },
    });
  });
}
