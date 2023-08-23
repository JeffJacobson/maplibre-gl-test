import type { LngLatLike } from "maplibre-gl";

/**
 * Extracts the X and Y coordinates from a {@link LngLatLike}.
 * @param lngLat - A {@link LngLatLike}
 * @returns - An array of two numbers.
 */
export function extractXY(lngLat: LngLatLike) {
    let xy: [x: number, y: number];
    if (Array.isArray(lngLat)) {
      xy = lngLat;
    } else {
      xy = ["lon" in lngLat ? lngLat.lon : lngLat.lng, lngLat.lat];
    }
    return xy;
  }
  