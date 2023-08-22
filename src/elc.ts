import type { LngLatLike } from "maplibre-gl";
import { RouteLocator } from "wsdot-elc";

/**
 * Calls the ELC to get the nearest route to where the user clicked.
 * @param lngLat - The coordinates the user clicked.
 * @returns - A promise returning an array of route location objects.
 */
export async function callElc(lngLat: LngLatLike) {
  const xy: [number, number] = extractXY(lngLat);
  const routeLocator = new RouteLocator();
  const result = await routeLocator.findNearestRouteLocations({
    coordinates: xy,
    inSR: 4326,
    searchRadius: 300,
    referenceDate: new Date(),
  });
  return result;
}

/**
 * Extracts the X and Y coordinates from a {@link LngLatLike}.
 * @param lngLat - A {@link LngLatLike}
 * @returns - An array of two numbers.
 */
function extractXY(lngLat: LngLatLike) {
  let xy: [x: number, y: number];
  if (Array.isArray(lngLat)) {
    xy = lngLat;
  } else {
    xy = ["lon" in lngLat ? lngLat.lon : lngLat.lng, lngLat.lat];
  }
  return xy;
}
