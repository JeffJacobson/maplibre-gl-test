import {
  GeolocateControl,
  Map as MapLibreMap,
  LngLatBounds,
  NavigationControl,
} from "maplibre-gl";
import { callElc } from "./elc";
import { getLayerIdUrls } from "./lrs"
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
map.addControl(
  new NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true,
  })
);

// Add geolocate control to the map.
map.addControl(
  new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })
);

/**
 * Adds layers to the map.
 */
function addLayers() {
  for (const [name, url] of getLayerIdUrls()) {
    map.addSource(name, {
      type: "geojson",
      data: url.toString()
    });

    map.addLayer({
      id: `${name}-line`,
      type: "line",
      source: name,

      paint: {
        "line-color": "red",
        "line-width": 10
      }
    })
  }
}


// map.on("styleimagemissing", (ev) => {
//   console.warn("style image missing", ev);
// });

void map.once("load", (ev) => {
  const currentBounds = ev.target.getBounds();
  console.log("current bounds", currentBounds.toArray());

  addLayers();

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

