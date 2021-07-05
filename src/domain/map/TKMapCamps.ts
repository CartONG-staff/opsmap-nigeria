import { TKCampDescription } from "@/domain/survey/TKCampDescription";
import { FeatureCollection } from "geojson";

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
            coordinates: [camp.lng, camp.lat]
          },
          properties: {
            id: camp.id,
            name: camp.name,
            type: camp.type,
            // lastSubmission: camp.submissionsDates[0],
            lat: camp.lat,
            lng: camp.lng,
            admin1: camp.admin1,
            admin2: camp.admin2,
            admin3: camp.admin3
          }
        };
      })
    };
  }

  toTKCampDescription(featureID: string): TKCampDescription {
    return this.camps.find(x => x.id === featureID) as TKCampDescription;
  }

  filterCamps(): TKFilteredCamps {
    return {
      selectedCamp: this.toGeoJSON(
        this.camps.filter(x => x.id === this.currentCamp?.id)
      ),
      otherCamps: this.toGeoJSON(
        this.currentCamp
          ? this.camps.filter(x => x.id !== this.currentCamp?.id)
          : this.camps
      )
    };
  }
}
