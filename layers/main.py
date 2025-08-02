from geopandas import GeoDataFrame
import yaml

from areas import build as build_areas
from ped_infra import build as build_ped_infra

BUILDERS = [build_areas, build_ped_infra]

def write_outputs(slug: str, name: str, gdf: GeoDataFrame):
    gdf.to_file(f"{slug}-{name}.geojson")
    # incorrect CRS for GeoParquet. Need to investigate.
    # gdf.to_parquet(f"{slug}-area.geoparquet", index=False)

def read_config():
    with open("index.yml") as src:
        return yaml.safe_load(src)

if __name__ == "__main__":
    config = read_config()
    for area in config["areas"]:
        for builder in BUILDERS:
            writer = lambda n, g: write_outputs(area["slug"], n, g)
            gdf = builder(area["selectors"], writer)
