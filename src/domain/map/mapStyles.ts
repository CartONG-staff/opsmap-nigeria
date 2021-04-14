export const layers = {
  countryBoundaries: {
    id: "nigeria",
    type: "fill",
    source: "nationalBoundaries",
    layout: {},
    paint: {
      "fill-color": "#585858",
      "fill-opacity": 0.7,
    },
  },
  statesBoundaries: {
    id: "statesBoundaries",
    type: "fill",
    source: "statesBoundaries",
    layout: {},
    paint: {
      "fill-color": "#585858",
      "fill-opacity": [
        "match",
        ["get", "transparent"],
        "yes",
        0.0,
        "no",
        0.7,
        0.0,
      ],
    },
  },
  lgasBoundaries: {
    id: "lgasBoundaries",
    type: "fill",
    source: "lgasBoundaries",
    layout: {},
    paint: {
      "fill-color": "#585858",
      "fill-opacity": [
        "match",
        ["get", "transparent"],
        "yes",
        0.0,
        "no",
        0.7,
        0.0,
      ],
    },
  },
  clusters: {
    id: "clusters",
    type: "circle",
    source: "otherCamps",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#78b4ff",
        10,
        "#337fdd",
        30,
        "#286090",
      ],
      "circle-radius": ["step", ["get", "point_count"], 10, 10, 15, 30, 20],
    },
  },
  clustersCount: {
    id: "cluster-count",
    type: "symbol",
    source: "otherCamps",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["Arial Unicode MS Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": "#ffffff",
    },
  },
  camps: {
    id: "camps",
    type: "symbol",
    source: "otherCamps",
    // filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": [
        "match",
        ["get", "site_type"],
        "Planned Camps",
        "planned_site",
        "Spontaneous Camps",
        "spontaneous_site",
        "default", // everything else
      ],
      "icon-size": 0.025,
    },
  },
  selectedCamp: {
    id: "camp",
    type: "symbol",
    source: "selectedCamp",
    layout: {
      "icon-image": [
        "match",
        ["get", "site_type"],
        "Planned Camps",
        "planned_site",
        "Spontaneous Camps",
        "spontaneous_site",
        "default", // everything else
      ],
      "icon-size": 0.035,
    },
  },
};
