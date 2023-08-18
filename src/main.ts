import { Map as MapLibreMap, LngLatBounds, NavigationControl } from "maplibre-gl";
import { callElc } from "./elc";
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

// Add zoom and rotation controls to the map.
map.addControl(new NavigationControl({
  showCompass: true,
  showZoom: true,
  visualizePitch: true
}));


map.on("styleimagemissing", (ev) => {
  console.warn("style image missing", ev);
})

map.on("load", (ev) => {
  const currentBounds = ev.target.getBounds();
  console.log("current bounds", currentBounds.toArray());

  map.on("click", (e) => {
    const { lng: x, lat: y } = e.lngLat;

    console.debug(`You clicked ${x},${y}!`);

    callElc(e.lngLat).then(
      (elcResult) => {
        console.log("elc result", elcResult);
      },
      (reason) => console.error("elc error", reason)
    );
  });
});
