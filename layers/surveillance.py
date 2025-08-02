from geopandas import GeoDataFrame
from osm2geojson import overpass_call, xml2shapes
from typing import List

def build_query(selectors: List[str]):
    query = ""
    for i, s in enumerate(selectors):
        query += f"area{s} -> .area{i};\n"
    query += "("
    for i in range(len(selectors)):
        query += f"""
            nwr[man_made=surveillance](area.area{i});
        """
    return query + ");\nout center;"

def build(selectors: List[str], writer) -> GeoDataFrame:
    query = build_query(selectors)
    xml = overpass_call(query)
    shapes = xml2shapes(xml)
    gdf = GeoDataFrame(
        data=[s["properties"] for s in shapes],
        geometry=[s["shape"] for s in shapes],
    )
    writer("surveillance", gdf)
