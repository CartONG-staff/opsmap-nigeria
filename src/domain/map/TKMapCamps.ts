/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TKCampDescription } from "@/domain/core/TKCampDescription";
import { FeatureCollection } from "geojson";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";

interface TKFilteredCamps {
  selectedCamp: FeatureCollection | string;
  otherCamps: FeatureCollection;
}

export class TKMapCamps {
  public filteredCamps: TKFilteredCamps;

  constructor(
    private camps: TKCampDescription[],
    private currentCamp: TKCampDescription | null
  ) {
    this.camps = camps;
    this.currentCamp = currentCamp;
    this.filteredCamps = this.filterCamps();
  }

  toGeoJSON(campsArray: TKCampDescription[]): FeatureCollection {
    return {
      type: "FeatureCollection",
      features: campsArray.map((camp: TKCampDescription) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [camp.lng, camp.lat],
          },
          properties: { ...camp },
        };
      }),
    };
  }

  toTKCampDescription(featureID: string): TKCampDescription {
    console.log(featureID);
    console.log(this.camps.find((x) => x.id === featureID));

    return this.camps.find((x) => x.id === featureID) as TKCampDescription;
  }

  filterCamps(): TKFilteredCamps {
    return {
      selectedCamp: this.toGeoJSON(
        this.camps.filter((x) => x.id === this.currentCamp?.id)
      ),
      otherCamps: this.toGeoJSON(
        this.currentCamp === null
          ? this.camps
          : this.camps.filter((x) => x.id !== this.currentCamp!.id)
      ),
    };
  }
}
