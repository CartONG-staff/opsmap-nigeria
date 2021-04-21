/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
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

  changeStyle(dataset: TKDatasetFilterer, map: mapboxgl.Map): void {
    let ifAdmin1NotDefined = null;
    switch (dataset.levelOfChange) {
      case TKFilters.SURVEY:
        for (const item of this.admin1.features) {
          item.properties!.transparent = "yes";
        }
        for (const item of this.admin2.features) {
          item.properties!.transparent = "yes";
        }
        break;
      case TKFilters.ADMIN1:
        for (const item of this.admin1.features) {
          item.properties!.transparent = dataset.currentAdmin1
            ? item.properties!.pcode === dataset.currentAdmin1?.pcode
              ? "yes"
              : "no"
            : "yes";
        }
        for (const item of this.admin2.features) {
          item.properties!.transparent = "yes";
        }
        break;

      case TKFilters.CAMP:
      case TKFilters.ADMIN2:
        for (const item of this.admin2.features) {
          if (dataset.currentAdmin2) {
            if (item.properties!.pcode === dataset.currentAdmin2?.pcode) {
              item.properties!.transparent = "yes";
              ifAdmin1NotDefined = item.properties!.adm1pcode;
            } else {
              item.properties!.transparent = "no";
            }
          } else {
            item.properties!.transparent = "yes";
          }
        }
        for (const item of this.admin1.features) {
          if (ifAdmin1NotDefined) {
            item.properties!.transparent = dataset.currentAdmin1
              ? item.properties!.pcode === dataset.currentAdmin1?.pcode
                ? "yes"
                : "no"
              : item.properties!.pcode === ifAdmin1NotDefined
              ? "yes"
              : "no";
          } else {
            for (const item of this.admin1.features) {
              item.properties!.transparent = dataset.currentAdmin1
                ? item.properties!.pcode === dataset.currentAdmin1?.pcode
                  ? "yes"
                  : "no"
                : "yes";
            }
          }
        }

        break;
      default:

        break;
    }
    (map.getSource(TKMapLayers.ADMIN1SOURCE) as mapboxgl.GeoJSONSource).setData(
      this.admin1
    );
    (map.getSource(TKMapLayers.ADMIN2SOURCE) as mapboxgl.GeoJSONSource).setData(
      this.admin2
    );
  }

  // getBoundingBoxFromCoordinatesArray(coordinates) {
  //   const bounds = { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
  //   let latitude, longitude;

  //   if (coordinates.length === 1) {
  //     // It's only a single Polygon
  //     for (const c of coordinates[0]) {
  //       latitude = c[0];
  //       longitude = c[1];

  //       bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
  //       bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
  //       bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
  //       bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
  //     }
  //   } else {
  //     // It's a MultiPolygon
  //     // Loop through each coordinate set
  //     for (const coord of coordinates) {
  //       for (const c of coord) {
  //         latitude = c[0];
  //         longitude = c[1];

  //         // Update the bounds recursively by comparing the current xMin/xMax and yMin/yMax with the current coordinate
  //         bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
  //         bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
  //         bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
  //         bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
  //       }
  //     }
  //   }

  //   // Returns an object that contains the bounds of this GeoJSON data.
  //   // The keys describe a box formed by the northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
  //   return [
  //     [bounds.xMin, bounds.yMin],
  //     [bounds.xMax, bounds.yMax],
  //   ];
  // }
}
