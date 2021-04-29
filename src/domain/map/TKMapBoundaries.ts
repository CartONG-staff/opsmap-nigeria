import { Feature, FeatureCollection } from "geojson";
import mapboxgl, { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";
import { TKDatasetFilterer, TKFilters } from "@/domain/survey/TKFilters";
import { TKGeoDataset } from "@/domain/map/TKGeoDataset";
import { TKMapLayers } from "./TKMapLayers";

export class TKMapBoundaries {
  public admin1: FeatureCollection;
  public admin2: FeatureCollection;

  constructor(geodataset: TKGeoDataset) {
    this.admin1 = geodataset.admin1;
    this.admin2 = geodataset.admin2;
  }

  changeStyle(
    dataset: TKDatasetFilterer,
    map: mapboxgl.Map,
    bound: LngLatBounds
  ): void {
    let setZoom;
    switch (dataset.levelToZoom) {
      case TKFilters.SURVEY:
        this.mapFitBounds(bound, map);
        for (const item of this.admin1.features) {
          if (item.properties) {
            item.properties.transparent = "yes";
          }
        }
        for (const item of this.admin2.features) {
          if (item.properties) {
            item.properties.transparent = "yes";
          }
        }
        break;
      case TKFilters.ADMIN1:
        setZoom = this.setAdmin1Style(dataset);
        if (setZoom) {
          this.mapFitBounds(setZoom, map);
        }
        for (const item of this.admin2.features) {
          if (item.properties) {
            item.properties.transparent = "yes";
          }
        }
        break;
      case TKFilters.CAMP:
      case TKFilters.ADMIN2:
        setZoom = this.setAdmin1Style(dataset);
        setZoom = this.setAdmin2Style(dataset);
        if (setZoom) {
          this.mapFitBounds(setZoom, map);
        }
        break;
      default:
        break;
    }
    if (dataset.currentCamp) {
      this.mapFitBounds(
        new LngLat(dataset.currentCamp.lng, dataset.currentCamp.lat).toBounds(
          100
        ),
        map
      );
    }
    (map.getSource(TKMapLayers.ADMIN1SOURCE) as mapboxgl.GeoJSONSource)?.setData(
      this.admin1
    );
    (map.getSource(TKMapLayers.ADMIN2SOURCE) as mapboxgl.GeoJSONSource)?.setData(
      this.admin2
    );
  }

  setAdmin1Style(dataset: TKDatasetFilterer) {
    let shouldMapZoom = null;
    for (const item of this.admin1.features) {
      if (dataset.currentAdmin1) {
        if (item.properties?.pcode === dataset.currentAdmin1?.pcode) {
          if (item.properties) {
            item.properties.transparent = "yes";
          }
          if (dataset.levelToZoom === TKFilters.ADMIN1) {
            shouldMapZoom = this.getBoundingBoxFromCoordinatesArray(item);
          }
        } else {
          if (item.properties) {
            item.properties.transparent = "no";
          }
        }
      } else {
        if (item.properties) {
          item.properties.transparent = "yes";
        }
      }
    }
    return shouldMapZoom;
  }

  setAdmin2Style(dataset: TKDatasetFilterer) {
    let shouldMapZoom = null;
    for (const item of this.admin2.features) {
      if (dataset.currentAdmin2) {
        if (item.properties?.pcode === dataset.currentAdmin2?.pcode) {
          if (item.properties) {
            item.properties.transparent = "yes";
          }
          if (dataset.levelToZoom === TKFilters.ADMIN2) {
            shouldMapZoom = this.getBoundingBoxFromCoordinatesArray(item);
          }
        } else {
          if (item.properties) {
            item.properties.transparent = "no";
          }
        }
      } else {
        if (item.properties) {
          item.properties.transparent = "yes";
        }
      }
    }
    return shouldMapZoom;
  }

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
