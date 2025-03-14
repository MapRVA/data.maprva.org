import fs from "fs";
import queryOverpass from "query-overpass";

queryOverpass(
  `
  area[wikidata=Q43421][type=boundary] -> .searchArea;
  (
    nwr[highway=footway][footway=sidewalk](area.searchArea);
    nwr[highway=footway][footway=crossing](area.searchArea);
  );
  out geom meta;
  `,
  (error, data) => {
    if (error) {
      console.error(error);
    } else {
      fs.writeFileSync("osm-sidewalks.geojson", JSON.stringify(data));
    }
  },
)
