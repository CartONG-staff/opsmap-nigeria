import { Feature, FeatureCollection } from "geojson";
import mapboxgl, { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";
import {
  TKDataset,
  TKAdminFilters,
  ADMIN_FILTERS_TO_ADMIN_LEVEL
} from "@/domain/survey/TKDataset";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKFDFSpatialDescription } from "../fdf/TKFDFSpatialDescription";
import { TKOpsmapSpatialConfiguration } from "../opsmapConfig/TKOpsmapConfiguration";
import {
  TKAdminLevel,
  arrayLevelBelowToLeaf,
  leaf
} from "../opsmapConfig/TKAdminLevel";
import { TKBoundaries } from "../survey/TKBoundaries";
import { COUNTRY_MASK } from "./TKMapLayers";

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

  clearLevels(levels: Array<TKAdminLevel>) {
    levels.forEach(level => {
      for (const feature of this.geodataset[level as TKAdminLevel]?.features ??
        []) {
        if (feature.properties) {
          feature.properties.transparent = "yes";
        }
      }
    });
  }

  changeStyle(
    dataset: TKDataset,
    map: mapboxgl.Map,
    bound: LngLatBounds
  ): void {
    // If survey level
    if (dataset.levelToZoom === TKAdminFilters.SURVEY) {
      this.mapFitBounds(bound, map);
      // Clear all levels
      this.clearLevels(
        Object.keys(this.geodataset).map(key => key as TKAdminLevel)
      );
    }
    // If other level
    else {
      let boundaryLevel: TKAdminLevel | null;
      if (dataset.levelToZoom === TKAdminFilters.SITE) {
        boundaryLevel = leaf();
      } else {
        boundaryLevel = ADMIN_FILTERS_TO_ADMIN_LEVEL[dataset.levelToZoom];
      }

      if (boundaryLevel) {
        const setZoom = this.setAdminStyle(boundaryLevel, dataset);
        arrayLevelBelowToLeaf(boundaryLevel).forEach(level => {
          this.setAdminStyle(level, dataset);
        });
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

    Object.keys(this.geodataset).forEach(level => {
      (map.getSource(level) as mapboxgl.GeoJSONSource)?.setData(
        this.geodataset[level as TKAdminLevel] as FeatureCollection
      );
    });
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
    arrayLevelBelowToLeaf(level).forEach(levelBelow => {
      if (dataset.getCurrentAdmin(levelBelow)) {
        return true;
      }
    });
    return false;
  }

  setAdminStyle(level: TKAdminLevel, dataset: TKDataset) {
    let shouldMapZoom = null;
    const currentadminList = (dataset.getFilteredAdminList(
      level
    ) as TKBoundaries[]).map(item => item.pcode);
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
