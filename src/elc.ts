import type { LngLatLike } from "maplibre-gl";
import { RouteLocation, RouteLocator } from "wsdot-elc";
import { extractXY } from "./utils";

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
    outSR: 4326,
    searchRadius: 300,
    referenceDate: new Date(),
  });
  return result;
}

export interface ElcPoint {
  x: number;
  y: number;
}

export interface ElcPolyline {
  paths: number[][][];
}

/**
 * Determines if the input geometry is a point (rather than a polyline).
 * @param geometry - Geometry returned from ELC.
 * @returns - Returns true if the geometry is a point, false otherwise.
 */
export const isPoint = (
  geometry: RouteLocation["RouteGeometry"]
): geometry is ElcPoint => !!geometry && "x" in geometry && "y" in geometry;

/**
 * Determines if the input geometry is a polyline.
 * @param geometry - Geometry returned from ELC.
 * @returns - Returns true if the geometry is a polyline, false otherwise.
 */
export const isPolyline = (
  geometry: RouteLocation["RouteGeometry"]
): geometry is ElcPolyline => !!geometry && "paths" in geometry;
