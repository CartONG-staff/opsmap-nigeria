import { FeatureCollection } from "geojson";
import { TKCamp } from "@/domain/survey/TKCamp";
import { TKDataset } from "../survey/TKDataset";
import { TKGeoDataset } from "./TKGeoDataset";
import { TKOpsmapSpatialConfiguration } from "../opsmapConfig/TKOpsmapConfiguration";
import mapboxgl, { LngLat } from "mapbox-gl";
import centroid from "@turf/centroid";
interface TKFilteredCamps {
  selectedCamp: FeatureCollection | string;
  otherCamps: FeatureCollection;
}

export class TKMapCamps {
  public filteredCamps: TKFilteredCamps;
  private currentAdminLevel: null | string = null;

  constructor(
    private camps: TKCamp[],
    private currentCamp: TKCamp | null,
    private dataset: TKDataset,
    private geoDataset: TKGeoDataset,
    private spatialConfiguration: TKOpsmapSpatialConfiguration
  ) {
    this.dataset = dataset;
    this.geoDataset = geoDataset;
    this.spatialConfiguration = spatialConfiguration;
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
            coordinates: [camp.lng, camp.lat]
          },
          properties: {
            id: camp.id,
            name: camp.name,
            type: camp.type.formattedName,
            lastSubmission: camp.submissions[0].date,
            lat: camp.lat,
            lng: camp.lng,
            admin1: camp.admin1,
            admin2: camp.admin2
          }
        };
      })
    };
  }

  toAnonymisedGeoJSON(campsArray: TKCamp[]): FeatureCollection {
    let newLng: number, newLat: number;
    return {
      type: "FeatureCollection",
      features: campsArray.map((camp: TKCamp) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const admin2 = this.geoDataset.admin2.features.filter(x => x.properties![this.spatialConfiguration.dbConfig.adm2DBPcode] === camp.admin2.pcode);
        if (admin2.length > 0) {
          const center = centroid(admin2[0] as any)
          camp.lng = center.geometry.coordinates[0];
          camp.lat = center.geometry.coordinates[1];
          newLng = center.geometry.coordinates[0];
          newLat = center.geometry.coordinates[1];
        } else {
          newLng = this.getCenterOfBounds(this.spatialConfiguration.mapConfig.bounds).lng;
          newLat = this.getCenterOfBounds(this.spatialConfiguration.mapConfig.bounds).lat;
        }
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [newLng, newLat]
          },
          properties: {
            id: camp.id,
            name: camp.name,
            type: camp.type.formattedName,
            lastSubmission: camp.submissions[0].date,
            lat: newLng,
            lng: newLat,
            admin1: camp.admin1,
            admin2: camp.admin2
          }
        };
      })
    };
  }

  filterCamps(): TKFilteredCamps {
    return {
      selectedCamp:
        this.dataset.currentSurvey.options.anonymousMode === "Global"
          ? this.toAnonymisedGeoJSON(
              this.camps.filter(camp => camp.id === this.currentCamp?.id)
            )
          : this.toGeoJSON(
              this.camps.filter(camp => camp.id === this.currentCamp?.id)
            ),
      otherCamps:
        this.dataset.currentSurvey.options.anonymousMode === "Global"
          ? this.toAnonymisedGeoJSON(
              this.currentCamp
                ? this.camps.filter(camp => camp.id !== this.currentCamp?.id)
                : this.camps
            )
          : this.toGeoJSON(
              this.currentCamp
                ? this.camps.filter(camp => camp.id !== this.currentCamp?.id)
                : this.camps
            )
    };
  }

  getCenterOfBounds(bounds: number[]): LngLat {
    const sw = new mapboxgl.LngLat(bounds[0], bounds[1]);
    const ne = new mapboxgl.LngLat(bounds[2], bounds[3]);
    return new mapboxgl.LngLatBounds(sw, ne).getCenter();
  }
}
