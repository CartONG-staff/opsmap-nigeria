import { Feature, FeatureCollection } from "geojson";
import mapboxgl, { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKFDFSpatialDescription } from "@/domain/fdf/TKFDFSpatialDescription";
import { TKOpsmapSpatialConfiguration } from "@/domain/opsmapConfig/TKOpsmapConfiguration";
import {
  TKAdminLevel,
  closestAncesterInAdminLevelMap,
  leaf
} from "@/domain/opsmapConfig/TKAdminLevel";
import { TKBoundaries } from "@/domain/survey/TKBoundaries";
import { COUNTRY_MASK } from "./TKMapLayers";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import TKDatasetModule from "@/store/modules/dataset/TKDatasetModule";

export class TKMapBoundaries {
  public geodataset: TKGeoDataset;
  public dbConfig: TKOpsmapSpatialConfiguration["dbConfig"];
  public spatial: TKFDFSpatialDescription;

  constructor(
    geodataset: TKGeoDataset,
    dbConfig: TKOpsmapSpatialConfiguration["dbConfig"],
    spatial: TKFDFSpatialDescription
  ) {
    this.geodataset = geodataset;
    this.dbConfig = dbConfig;
    this.spatial = spatial;
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  initLayersStyle(map: mapboxgl.Map) {
    // Split in two tempos -> for transition
    map.setPaintProperty(COUNTRY_MASK, "fill-opacity", 0.5);
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  updateBoundariesStyle(map: mapboxgl.Map, defaultBound: LngLatBounds): void {
    // Most granular admin level filter
    let boundaryLevel: TKAdminLevel | null = null;

    // If Current Submission
    if (TKDatasetModule.dataset.hasCurrentSubmission) {
      const leafLevel = leaf();
      if (leafLevel) {
        boundaryLevel = closestAncesterInAdminLevelMap(leafLevel);
      }
    }
    // Else: Look for most precise admin
    else {
      const ref = TKDatasetModule.dataset.mostGranularAdminLevelFilter;
      if (ref) {
        boundaryLevel = closestAncesterInAdminLevelMap(ref);
      }
    }

    // If has boundary level
    if (boundaryLevel) {
      // Current site: set parent admin boundaries, zoom on site
      if (TKDatasetModule.dataset.currentSite) {
        this.setAdminStyle(boundaryLevel);
        map.fitBounds(
          new LngLat(
            TKDatasetModule.dataset.currentSite.coordinates.lng,
            TKDatasetModule.dataset.currentSite.coordinates.lat
          ).toBounds(100)
        );
      }
      // Current admin: set admin boundaries, zoom on admin
      else {
        const boundingBox = this.setAdminStyle(boundaryLevel);
        if (boundingBox) {
          map.fitBounds(boundingBox);
        }
      }
    }
    // else: survey level
    else {
      map.fitBounds(defaultBound);
      for (const level of TKConfigurationModule.configuration.spatial
        .adminLevelsMap) {
        this.hideLevel(level);
      }
    }

    // ?
    for (const level of Object.keys(this.geodataset)) {
      (map.getSource(level) as mapboxgl.GeoJSONSource)?.setData(
        this.geodataset[level as TKAdminLevel] as FeatureCollection
      );
    }
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  setAdminStyle(level: TKAdminLevel): mapboxgl.LngLatBounds | null {
    // Hide all levls
    for (const level of TKConfigurationModule.configuration.spatial
      .adminLevelsMap) {
      this.hideLevel(level);
    }

    // Iterate through features
    const currentAdmin = TKDatasetModule.dataset.getCurrentAdmin(level);
    if (!currentAdmin) {
      return null;
    }
    for (const feature of this.geodataset[level]?.features ?? []) {
      if (feature.properties) {
        if (
          // Show
          TKDatasetModule.dataset.getCurrentAdmin(level) &&
          (TKDatasetModule.dataset.getCurrentAdmin(level) as TKBoundaries)
            .pcode === feature.properties[this.dbConfig[level]]
        ) {
          feature.properties.display = "focus";
          return this.getBoundingBoxFromCoordinatesArray(feature);
        }
      }
    }
    return null;
  }

  hideLevel(level: TKAdminLevel) {
    for (const item of this.geodataset[level]?.features ?? []) {
      if (item.properties) {
        // Hide if more granular is active
        item.properties.display = "hide";
      }
    }
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  getBoundingBoxFromCoordinatesArray(item: Feature): LngLatBounds {
    const bounds = { xMin: 180, xMax: -180, yMin: 180, yMax: -180 };
    let latitude, longitude;
    if (item.geometry.type === "Polygon") {
      for (const c of item.geometry.coordinates[0]) {
        latitude = c[1];
        longitude = c[0];

        bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
        bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
        bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
        bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
      }
    } else if (item.geometry.type === "MultiPolygon") {
      for (const coord of item.geometry.coordinates) {
        for (const c of coord) {
          latitude = (c[1] as unknown) as number;
          longitude = (c[0] as unknown) as number;

          bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
          bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
          bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
          bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
        }
      }
    }

    return new LngLatBounds(
      [bounds.xMin, bounds.yMin] as LngLatLike,
      [bounds.xMax, bounds.yMax] as LngLatLike
    );
  }
}
