import { FeatureCollection } from "geojson";
import { TKCamp, TKCampCoordinates } from "@/domain/survey/TKCamp";
// import { TKDataset } from "../survey/TKDataset";
import { TKGeoDataset } from "./TKGeoDataset";
// import { TKOpsmapSpatialConfiguration } from "../opsmapConfig/TKOpsmapConfiguration";
import mapboxgl, { LngLat } from "mapbox-gl";
import centroid from "@turf/centroid";
// import { TKSurveyAnonymousType } from "../survey/TKSurvey";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
interface TKFilteredCamps {
  selectedCamp: FeatureCollection | string;
  otherCamps: FeatureCollection;
}

export function getCenterOfBounds(bounds: number[]): LngLat {
  const sw = new mapboxgl.LngLat(bounds[0], bounds[1]);
  const ne = new mapboxgl.LngLat(bounds[2], bounds[3]);
  return new mapboxgl.LngLatBounds(sw, ne).getCenter();
}

export class TKMapCamps {
  public filteredCamps: TKFilteredCamps;
  // private currentAdminLevel: null | string = null;

  constructor(
    private camps: TKCamp[],
    private currentCamp: TKCamp | null // private dataset: TKDataset, // private geoDataset: TKGeoDataset, // private spatialConfiguration: TKOpsmapSpatialConfiguration
  ) {
    // this.dataset = dataset;
    // this.geoDataset = geoDataset;
    // this.spatialConfiguration = spatialConfiguration;
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
            coordinates: [camp.coordinates.lng, camp.coordinates.lat]
          },
          properties: {
            id: camp.id,
            name: camp.name,
            type: camp.type.formattedName,
            lastSubmission: camp.submissions[0].date,
            lat: camp.coordinates.lat,
            lng: camp.coordinates.lng,
            admin1: camp.admin1,
            admin2: camp.admin2
          }
        };
      })
    };
  }

  filterCamps(): TKFilteredCamps {
    return {
      selectedCamp: this.toGeoJSON(
        this.camps.filter(camp => camp.id === this.currentCamp?.id)
      ),
      otherCamps: this.toGeoJSON(
        this.currentCamp
          ? this.camps.filter(camp => camp.id !== this.currentCamp?.id)
          : this.camps
      )
    };
  }
}

export function computeCentroid(
  camp: TKCamp,
  geoDataset: TKGeoDataset
): TKCampCoordinates | false {
  // Compute Admin2 Centroid
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const admin2Feature = geoDataset.admin2.features.filter(
    x =>
      x.properties![
        TKConfigurationModule.configuration.spatialConfiguration.dbConfig
          .adm2DBPcode
      ] === camp.admin2.pcode
  );

  if (admin2Feature.length > 0) {
    const center = centroid(admin2Feature[0] as any);
    camp.coordinates = {
      lng: center.geometry.coordinates[0],
      lat: center.geometry.coordinates[1]
    };
  } else {
    // Compute Admin1 Centroid
    const admin1Feature = geoDataset.admin1.features.filter(
      x =>
        x.properties![
          TKConfigurationModule.configuration.spatialConfiguration.dbConfig
            .adm1DBPcode
        ] === camp.admin1.pcode
    );
    if (admin1Feature.length > 0) {
      const center = centroid(admin1Feature[0] as any);
      camp.coordinates = {
        lng: center.geometry.coordinates[0],
        lat: center.geometry.coordinates[1]
      };
    }
  }

  return false;
}
