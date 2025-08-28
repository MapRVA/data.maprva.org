import fs from "fs";
import queryOverpass from "query-overpass";

queryOverpass(
  `
  area[wikidata=Q43421][type=boundary] -> .searchArea;
  (
    area[building](area.searchArea);
  );
  out geom meta;
  `,
  (error, data) => {
    if (error) {
      console.error(error);
    } else {
      fs.writeFileSync("rva-buildings.geojson", JSON.stringify(data));
    }
  },
)
