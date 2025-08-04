import fs from "fs";
import queryOverpass from "query-overpass";

queryOverpass(
  `
  area[wikidata=Q43421][type=boundary] -> .searchArea;
    (
      nwr["highway"~"motorway|trunk|primary|secondary|tertiary|unclassified|residential|motorway_link|trunk_link|primary_link|secondary_link|tertiary_link|living_street|service"](area.searchArea);
      // should we add pedestrian, track, bus_guideway, escape, raceway, road, busway?
    );
  out geom meta;
  `,
  (error, data) => {
    if (error) {
      console.error(error);
    } else {
      fs.writeFileSync("rva-roads.geojson", JSON.stringify(data));
    }
  },
);
