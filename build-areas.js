import fs from "fs";
import { mask } from "@turf/mask";
import { union } from "@turf/union";
import queryOverpass from "query-overpass";

queryOverpass(
  `nwr[wikidata=Q1370][type=boundary]; out geom;`,
  (error, data) => {
    if (error) {
      console.error(error);
    } else {
      data = data.features.filter((f) => f.geometry.type === "Polygon")[0];
      fs.writeFileSync("va-area.geojson", JSON.stringify(data));
      data = mask(data);
      fs.writeFileSync("va-mask.geojson", JSON.stringify(data));
    }
  },
);
queryOverpass(
  `nwr[wikidata=Q43421][type=boundary]; out geom;`,
  (error, data) => {
    if (error) {
      console.error(error);
    } else {
      data = data.features.filter((f) => f.geometry.type === "Polygon")[0];
      fs.writeFileSync("rva-area.geojson", JSON.stringify(data));
      data = mask(data);
      fs.writeFileSync("rva-mask.geojson", JSON.stringify(data));
    }
  },
);
queryOverpass(
  `
  (
    nwr[wikidata=Q43421][type=boundary];
    nwr[wikidata=Q341639][type=boundary];
    nwr[wikidata=Q340608][type=boundary];
  );
  out geom;
  `,
  (error, data) => {
    if (error) {
      console.error(error);
    } else {
      data.features = data.features.filter(
        (f) => f.geometry.type === "Polygon",
      );
      data = union(data);
      fs.writeFileSync("greater-rva-area.geojson", JSON.stringify(data));
      data = mask(data);
      fs.writeFileSync("greater-rva-mask.geojson", JSON.stringify(data));
    }
  },
);
