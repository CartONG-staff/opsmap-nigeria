import { CampDescription } from "@/domain/data/survey/merged_dataset/TKSubmissionsByCampsGrouper";
import { FeatureCollection } from "geojson";

export const campDescriptiontoGeoJSON = (
  campArray: CampDescription[]
): FeatureCollection => {
  const geojson: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };
  campArray.map((p: CampDescription) =>
    geojson.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [p.coordinates[1], p.coordinates[0]],
      },
      properties: {
        id: p.id,
        name: p.name,
        type: p.type,
        submissionsDates: p.submissionsDates,
      },
    })
  );
  return geojson;
};
