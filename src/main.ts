import { Map as MapLibreMap, LngLatBounds } from "maplibre-gl";
import { RouteLocator } from "wsdot-elc";
import("./style.css");

const waExtent = new LngLatBounds([-116.91, 45.54, -124.79, 49.05]);
const apiKey =
  "AAPKb42425df90804cb8889dc45c730c0560bXhJA9Cv77sUza9LrzZg9GmC9q4wE41_qYQUO2LtsR7c2UVmMUSFxCqn-btyr7in";

const map = new MapLibreMap({
  // container id
  container: "map",
  // style URL
  style: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/imagery?token=${apiKey}`,
  locale: "en-US",
  bounds: waExtent,
  hash: true,
  minZoom: 6,
  maxBounds: [
    [-132.12587499999995, 45.20677626387993],
    [-111.03212500000001, 49.39807247128476],
  ],
});

map.on("load", (ev) => {
  const currentBounds = ev.target.getBounds();
  console.log("current bounds", currentBounds.toArray());

  map.on("click", (e) => {
    const { lng: x, lat: y } = e.lngLat;

    console.debug(`You clicked ${x},${y}!`);

    const routeLocator = new RouteLocator();
    routeLocator
      .findNearestRouteLocations({
        coordinates: [x, y],
        inSR: 4326,
        searchRadius: 300,
        referenceDate: new Date(),
      })
      .then((result) => {
        console.log("ELC result", result);
      }, reason => {
        console.error(reason);
      });
  });
});
