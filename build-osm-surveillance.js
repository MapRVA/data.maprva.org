import fs from "fs";
import queryOverpass from "query-overpass";

queryOverpass(
  `
  // fetch Richmond, Henrico, and Chesterfield to search in
  area[wikidata=Q43421][type=boundary] -> .richmond;
  area[wikidata=Q341639][type=boundary] -> .henrico;
  area[wikidata=Q340608][type=boundary] -> .chesterfield;
  // fetch surveillance devices
  (
    nwr[man_made=surveillance](area.richmond);
    nwr[man_made=surveillance](area.henrico);
    nwr[man_made=surveillance](area.chesterfield);
  );
  out center;
  `,
  (error, data) => {
    if (error) {
      console.error(error);
    } else {
      fs.writeFileSync("osm-surveillance.geojson", JSON.stringify(data));
    }
  },
);
