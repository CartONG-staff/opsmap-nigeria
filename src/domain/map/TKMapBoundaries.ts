/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import { TKDatasetFilterer, TKFilters } from "../core/TKFilters";
import { TKGeoDataset } from "../core/TKGeoDataset";
import { TKMapLayers } from "./TKMapLayers";

export class TKMapBoundaries {
  public admin1: FeatureCollection;
  public admin2: FeatureCollection;

  constructor(geodataset: TKGeoDataset) {
    this.admin1 = geodataset.admin1;
    this.admin2 = geodataset.admin2;
  }

  changeStyle(dataset: TKDatasetFilterer, map: mapboxgl.Map): void {
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
          // if (item.properties!.pcode === dataset.currentAdmin1?.pcode) {
          //   map.fitBounds(
          //     this.getBoundingBoxFromCoordinatesArray(item.geometry.coordinates)
          //   );
          // }
        }
        for (const item of this.admin2.features) {
          item.properties!.transparent = "yes";
        }
        break;
      case TKFilters.ADMIN2:
        for (const item of this.admin1.features) {
          item.properties!.transparent = dataset.currentAdmin1
            ? item.properties!.pcode === dataset.currentAdmin1?.pcode
              ? "yes"
              : "no"
            : "yes";
        }
        for (const item of this.admin2.features) {
          item.properties!.transparent = dataset.currentAdmin2
            ? item.properties!.pcode === dataset.currentAdmin2?.pcode
              ? "yes"
              : "no"
            : "yes";
          // if (item.properties!.pcode === dataset.currentAdmin2?.pcode) {
          //   map.fitBounds(
          //     this.getBoundingBoxFromCoordinatesArray(item.geometry.coordinates)
          //   );
          // }
        }
        break;
      case TKFilters.CAMP:
        console.log("on Change de camps fréro");
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
