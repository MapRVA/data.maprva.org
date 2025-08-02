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
            nwr["highway"~"footway|steps"]["footway"!="link"](area.area{i});
            nwr["highway"~"cycleway|path"]["foot"!="no"](area.area{i});
        """
    return query + ");\nout geom meta;"

def build(selectors: List[str], writer) -> GeoDataFrame:
    query = build_query(selectors)
    xml = overpass_call(query)
    shapes = xml2shapes(xml)
    gdf = GeoDataFrame(
        data=[s["properties"] for s in shapes],
        geometry=[s["shape"] for s in shapes],
    )
    writer("ped-infra", gdf)
