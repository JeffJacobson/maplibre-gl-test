import {
  GeolocateControl,
  Map as MapLibreMap,
  Marker,
  LngLatBounds,
  NavigationControl,
} from "maplibre-gl";
import { callElc, isPoint } from "./elc";
import { getLayerIdUrls } from "./lrs";
import { RouteLocation } from "wsdot-elc";
import("./style.css");

const waExtent = new LngLatBounds([-116.91, 45.54, -124.79, 49.05]);
const apiKey =
  "AAPKb42425df90804cb8889dc45c730c0560bXhJA9Cv77sUza9LrzZg9GmC9q4wE41_qYQUO2LtsR7c2UVmMUSFxCqn-btyr7in";

const basemapEnum = "imagery";

const map = new MapLibreMap({
  // container id
  container: "map",
  // style URL
  style: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/${basemapEnum}?token=${apiKey}`,
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
      data: url.toString(),
    });

    map.addLayer({
      id: `${name}-line`,
      type: "line",
      source: name,

      paint: {
        "line-color": "red",
        "line-width": 10,
      },
    });
  }
}

// map.on("styleimagemissing", (ev) => {
//   console.warn("style image missing", ev);
// });


/**
 * Creates a marker representing a route location.
 * @param routeLocation - A route location
 * @returns - A marker
 */
function createMarker(routeLocation: RouteLocation) {
  const g = routeLocation.RouteGeometry as unknown;
  if (isPoint(g)) {
    const element = document.createElement("div");
    element.innerHTML = `<div>${routeLocation.Route}</div><div>${routeLocation.Srmp}${routeLocation.Back ? "B" : ""}</div>`;
    const marker = new Marker({
      className: "srmp-marker",
      element
    }).setLngLat([g.x, g.y]);
    return marker;
  }

  return null;
}

void map.once("load", (ev) => {
  const currentBounds = ev.target.getBounds();
  console.log("current bounds", currentBounds.toArray());

  addLayers();

  map.on("click", (e) => {
    callElc(e.lngLat).then(
      (elcResult) => {
        console.log("elc result", elcResult);
        elcResult.map(r => createMarker(r)?.addTo(map));
      },
      (reason) => {
        console.error("elc error", reason);
      }
    );
  });
});
