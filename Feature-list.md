# Kind of Feature list

This document is aimed at helping developer understand this project.

At this point, it is just a place to drop every infos relatives to the project.

This document is **NOT** a comitment to anything. It is **NOT** an official technical specifications.

## Standard version v1

### Features

- Handle Survey data as **KOBO only**

- Handle Survey description as new FDF versin (specs?)

> Requires work from partner and file spec from us. Add **version number** to the FDF.
> Requires also automatic conversion from excell to "per tab CSV" in the app

- Export to PDF

- Export to CSV

> Format **TBD**

- Handle Site history: multiple value for a single site

- Map: see UI section

### UI items desription

- Style and organization based on a mockup

> missing Lucille mockup

- Header item: OPSMAP name + clickable cluster logos
  - Always visible.

> (how much logos, fixed number ?)

- Camp Selection item
  - Comboboxes
    - 3 differents level (2 ochas + sitename)
    - combobox: editable, searchable
  - Map item
    - 2 types of sites: *informal settlement* et *planned map*
    - centered on the country
    - sites selectables

> **boundaries and darker area ? like in Nieria**

    - custerized by default
    - features: zoom, sites categories on/off,
    - legend is deployable, show total number for each site

> **?**

    - scales (auto adjust to zoom)
    - credits (adjust to basemap)

- Indicator panel

> **TBD**, but same in every opsmaps

- Text zone
  - opsmap production contexte

- Survey displayer
  - Toolbar
    - Search tool
    - Export to PDF
    - Export to CSV
  - Site abstract
    - site name, id, etc.
  - Survey datas, dispatched on block base on thematic
    - blocks: dispayed in 3-columns mode
    - block: header, icon, border (customizable)
    - block: visible if field
    - block-items: basic: name (string) + value (string)
    - block-items: indicator: computed on the fly: name (string) + value (string)
    - block-items: graphics: 3 types (histograms, donuts, radars)

> follow chartjs main items

    - block-items decorator: trafficlight

- Footer item
  - clickable partner logos

> (how much logos, fixed number ?)

## Standard version vXXX

- Identification and upload to UNHCR website

## Custom version.s

- Handle Survey data as custom CSV
- Handle Survey data as other API
- Handle some Data encryption
- Export to GeoJSON
- Export to KML
- **Temporal search**
- Public / private sections.
- Project abstract customization
- Change the map tool
- Customize the basemap
- Legend customization: open/close camps
- Provides other charts
- Extra charts
- 4 levels traffic lights: regular + "Minimal severity"
