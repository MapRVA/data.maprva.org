from shapely import Polygon, union_all
from geopandas import GeoDataFrame
from osm2geojson import overpass_call, xml2shapes
from typing import List

def build_query(selectors: List[str]):
    query = "(\n"
    for selector in selectors:
        query += f"nwr{selector};\n"
    return query + ");\nout geom;"

def build(selectors: List[str], writer) -> GeoDataFrame:
    # Query and process areas
    query = build_query(selectors)
    xml = overpass_call(query)
    shapes = xml2shapes(xml)
    union = union_all([s["shape"] for s in shapes])
    gdf = GeoDataFrame(geometry=[union], crs="EPSG:4326")
    writer("area", gdf)

    # Now let's calculate masks
    w, s, e, n = gdf.crs.area_of_use.bounds
    global_polygon = Polygon([(w, s), (e, s), (e, n), (w, n)])
    mask_gdf = GeoDataFrame(geometry=gdf["geometry"].apply(lambda g: global_polygon.difference(g)), crs=gdf.crs)
    writer("mask", mask_gdf)
