import { FeatureCollection } from "geojson";
import { TKCamp } from "@/domain/survey/TKCamp";
interface TKFilteredCamps {
  selectedCamp: FeatureCollection | string;
  otherCamps: FeatureCollection;
}

export class TKMapCamps {
  public filteredCamps: TKFilteredCamps;

  constructor(private camps: TKCamp[], private currentCamp: TKCamp | null) {
    this.camps = camps;
    this.currentCamp = currentCamp;
    this.filteredCamps = this.filterCamps();
  }

  toGeoJSON(campsArray: TKCamp[]): FeatureCollection {
    return {
      type: "FeatureCollection",
      features: campsArray.map((camp: TKCamp) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [camp.camp.lng, camp.camp.lat]
          },
          properties: {
            id: camp.camp.id,
            name: camp.camp.name,
            type: camp.camp.type,
            lastSubmission: camp.camp.lastSubmission,
            lat: camp.camp.lat,
            lng: camp.camp.lng,
            admin1: camp.camp.admin1,
            admin2: camp.camp.admin2,
            admin3: camp.camp.admin3
          }
        };
      })
    };
  }

  filterCamps(): TKFilteredCamps {
    return {
      selectedCamp: this.toGeoJSON(
        this.camps.filter(x => x.camp.id === this.currentCamp?.camp.id)
      ),
      otherCamps: this.toGeoJSON(
        this.currentCamp
          ? this.camps.filter(x => x.camp.id !== this.currentCamp?.camp.id)
          : this.camps
      )
    };
  }
}
