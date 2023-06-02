import { Feature, FeatureCollection } from "geojson";
import mapboxgl, { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";
import { TKDataset } from "@/domain/survey/TKDataset";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKFDFSpatialDescription } from "../fdf/TKFDFSpatialDescription";
import { TKOpsmapSpatialConfiguration } from "../opsmapConfig/TKOpsmapConfiguration";
import {
  TKAdminLevel,
  arrayLevelBelowToLeaf,
  closestAncesterInAdminLevelMap,
  leaf
} from "../opsmapConfig/TKAdminLevel";
import { TKBoundaries } from "../survey/TKBoundaries";
import { COUNTRY_MASK } from "./TKMapLayers";
import TKConfigurationModule from "@/store/modules/configuration/TKConfigurationModule";
import {
  ADMIN_FILTERS_TO_ADMIN_LEVEL,
  TKAdminFilterType
} from "../survey/TKAdminFilters";

export class TKMapBoundaries {
  public geodataset: TKGeoDataset;
  public dbConfig: TKOpsmapSpatialConfiguration["dbConfig"];
  public spatialDescription: TKFDFSpatialDescription;

  constructor(
    geodataset: TKGeoDataset,
    dbConfig: TKOpsmapSpatialConfiguration["dbConfig"],
    spatialDescription: TKFDFSpatialDescription
  ) {
    this.geodataset = geodataset;
    this.dbConfig = dbConfig;
    this.spatialDescription = spatialDescription;
  }

  // //////////////////////////////////////////////////////////////////////////
  //
  // //////////////////////////////////////////////////////////////////////////

  changeStyle(
    dataset: TKDataset,
    map: mapboxgl.Map,
    bound: LngLatBounds
  ): void {
    // If survey level
    if (dataset.levelToZoom === TKAdminFilterType.SURVEY) {
      this.mapFitBounds(bound, map);
      // Clear all levels
      for (const level of TKConfigurationModule.configuration
        .spatialConfiguration.adminLevelsMap) {
        this.hideLevel(level);
      }
    }
    // If other level
    else {
      let boundaryLevel: TKAdminLevel | null = null;
      if (dataset.levelToZoom === TKAdminFilterType.SITE) {
        const leafLevel = leaf();
        if (leafLevel) {
          boundaryLevel = closestAncesterInAdminLevelMap(leafLevel);
        }
      } else {
        boundaryLevel = closestAncesterInAdminLevelMap(
          ADMIN_FILTERS_TO_ADMIN_LEVEL[dataset.levelToZoom]
        );
      }

      if (boundaryLevel) {
        const setZoom = this.setAdminStyle(boundaryLevel, dataset);
        for (const level of TKConfigurationModule.configuration
          .spatialConfiguration.adminLevelsMap) {
          if (level != boundaryLevel) {
            this.hideLevel(level);
          }
        }

        if (setZoom) {
          this.mapFitBounds(setZoom, map);
        }
      }
    }

    if (dataset.currentSite) {
      this.mapFitBounds(
        new LngLat(
          dataset.currentSite.coordinates.lng,
          dataset.currentSite.coordinates.lat
        ).toBounds(100),
        map
      );
    }
    for (const level of Object.keys(this.geodataset)) {
      (map.getSource(level) as mapboxgl.GeoJSONSource)?.setData(
        this.geodataset[level as TKAdminLevel] as FeatureCollection
      );
    }
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
  isAdminLowerCurrent(level: TKAdminLevel, dataset: TKDataset): boolean {
    for (const levelBelow of arrayLevelBelowToLeaf(level)) {
      if (dataset.getCurrentAdmin(levelBelow)) {
        return true;
      }
    }
    return false;
  }

  setAdminStyle(level: TKAdminLevel, dataset: TKDataset) {
    let shouldMapZoom = null;
    const currentadminList = (dataset.getFilteredAdminList(
      level
    ) as TKBoundaries[]).map(item => item.pcode);

    // Iterate through features
    for (const item of this.geodataset[level]?.features ?? []) {
      if (item.properties) {
        if (this.isAdminLowerCurrent(level, dataset)) {
          // Hide if more granular is active
          item.properties.display = "hide";
        } else if (
          // Show
          dataset.getCurrentAdmin(level) &&
          (dataset.getCurrentAdmin(level) as TKBoundaries).pcode ===
            item.properties[this.dbConfig[level]]
        ) {
          shouldMapZoom = this.getBoundingBoxFromCoordinatesArray(item);
          item.properties.display = "focus";
          // TODO REMOVE THIS
        } else if (
          currentadminList.includes(item.properties[this.dbConfig[level]])
        ) {
          item.properties.display = "hide";
        } else {
          item.properties.display = "hide";
        }
      }
    }
    return shouldMapZoom;
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

  mapFitBounds(bounds: LngLatBounds, map: mapboxgl.Map) {
    map.fitBounds(bounds);
  }

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
