import { Map as MapLibreMap } from "maplibre-gl";
import("./style.css");

const waExtent: [number, number, number, number] = [
  -116.91, 45.54, -124.79, 49.05,
];
const apiKey =
  "AAPKb42425df90804cb8889dc45c730c0560bXhJA9Cv77sUza9LrzZg9GmC9q4wE41_qYQUO2LtsR7c2UVmMUSFxCqn-btyr7in";

new MapLibreMap({
  // container id
  container: "map",
  // style URL
  style: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/imagery?token=${apiKey}`,

  locale: "en-US",
  bounds: waExtent,
});
