import { FeatureCollection } from "geojson";
import { TKSite, TKSiteCoordinates } from "@/domain/survey/TKSite";
import { TKGeoDataset } from "./TKGeoDataset";
import mapboxgl, { LngLat } from "mapbox-gl";
import centroid from "@turf/centroid";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import { TKAdminLevel } from "@/domain/opsmapConfig/TKAdminLevel";
import { TKBoundaries } from "@/domain/survey/TKBoundaries";
interface TKFilteredSites {
  selectedSite: FeatureCollection | string;
  otherSites: FeatureCollection;
}

export function getCenterOfBounds(bounds: number[]): LngLat {
  const sw = new mapboxgl.LngLat(bounds[0], bounds[1]);
  const ne = new mapboxgl.LngLat(bounds[2], bounds[3]);
  return new mapboxgl.LngLatBounds(sw, ne).getCenter();
}

export class TKMapSites {
  public filteredSites: TKFilteredSites;

  constructor(private sites: TKSite[], private currentSite: TKSite | null) {
    this.sites = sites;
    this.currentSite = currentSite;
    this.filteredSites = this.filterSites();
  }

  toGeoJSON(sitesArray: TKSite[]): FeatureCollection {
    return {
      type: "FeatureCollection",
      features: sitesArray.map((site: TKSite) => {
        const adminsProperties: Partial<Record<
          TKAdminLevel,
          TKBoundaries
        >> = {};
        for (const level of TKConfigurationModule.configuration.spatial
          .adminLevelsMap) {
          adminsProperties[level] = site.admins[level];
        }

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [site.coordinates.lng, site.coordinates.lat]
          },
          properties: {
            id: site.id,
            name: site.name,
            type: site.type.id,
            lastSubmission: site.submissions[0].date,
            lat: site.coordinates.lat,
            lng: site.coordinates.lng,
            admins: adminsProperties
          }
        };
      })
    };
  }

  filterSites(): TKFilteredSites {
    return {
      selectedSite: this.toGeoJSON(
        this.sites.filter(site => site.id === this.currentSite?.id)
      ),
      otherSites: this.toGeoJSON(
        this.currentSite
          ? this.sites.filter(site => site.id !== this.currentSite?.id)
          : this.sites
      )
    };
  }
}

export function computeCentroid(
  site: TKSite,
  geoDataset: TKGeoDataset
): TKSiteCoordinates | false {
  // Loop through parent admins, more specific to more generic
  for (const level of [
    ...TKConfigurationModule.configuration.spatial.adminLevelsMap
  ].reverse()) {
    const feature = geoDataset[level]?.features.filter(
      x =>
        // eslint-disable-next-line
        x.properties![
          TKConfigurationModule.configuration.spatial.dbConfig[level]
        ] === (site.admins[level] as TKBoundaries).pcode
    );
    if (feature && feature.length > 0) {
      // eslint-disable-next-line
      const center = centroid(feature[0] as any);
      site.coordinates = {
        lng: center.geometry.coordinates[0],
        lat: center.geometry.coordinates[1]
      };
      return site.coordinates;
    }
  }

  return false;
}
