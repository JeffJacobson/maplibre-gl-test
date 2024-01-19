/**
 * An ELC SOE URL string.
 * E.g., https://data.wsdot.wa.gov/arcgis/rest/services/Shared/ElcRestSOE/MapServer/
 */
export type MapServiceUrlString =
  `https://${string}/arcgis/rest/services/${string}/MapServer/`;

/**
 * Creates an ELC SOE URL given a map service URL.
 *
 * @param mapServiceUrl - The map service URL. Defaults to "https://data.wsdot.wa.gov/arcgis/rest/services/Shared/ElcRestSOE/MapServer/" if not provided.
 * @return The ELC SOE URL.
 */
export function createElcSoeUrl(
  mapServiceUrl: MapServiceUrlString = "https://data.wsdot.wa.gov/arcgis/rest/services/Shared/ElcRestSOE/MapServer/"
) {
  // Append a trailing slash if it's not already there.
  if (!mapServiceUrl.endsWith("/")) {
    mapServiceUrl += "/";
  }
  // Create the ELC SOE URL.
  const extension = "exts/ElcRestSoe/";
  return new URL(extension, mapServiceUrl);
}

export interface GetNearestRouteLocationOptions {
  /** e.g., 12-31-2011 */
  referenceDate: Date;
  /** e.g.,  {{coordinates}} */
  coordinates: number[][];
  /* e.g.,  2927 */
  inSR: number;
  /**
   * Search radius in feet
   * e.g.,  300
   */
  searchRadius: number;
  /** e.g.,  2927 */
  outSR: number;
  /** e.g., Current */
  lrsYear?: string;
  /** e.g.,  LIKE '005%' */
  routeFilter?: string;
}

/**
 * Generates an iterator that yields key-value pairs for the given search parameters.
 *
 * @param options - The search parameters.
 * @yields - The key-value pairs for the search parameters.
 */
function* enumerateOptionsForSearchParams(
  options: GetNearestRouteLocationOptions
): Generator<[string, string], void, unknown> {
  yield ["f", "json"];
  for (const [key, value] of Object.entries(options)) {
    if (key === "coordinates" && Array.isArray(value)) {
      yield [key, value.flat().join(",")];
    } else if (typeof value === "number") {
      yield [key, value.toString()];
    } else if (value instanceof Date) {
      yield [
        key,
        `${value.getMonth() + 1}-${value.getDate()}-${value.getFullYear()}`,
      ];
    } else {
      yield [key, value];
    }
  }
}

// const sampleResult = [
//   {
//     Angle: 155.47073472103284,
//     Arm: 0,
//     ArmCalcReturnCode: 0,
//     ArmCalcReturnMessage: "",
//     Back: false,
//     Decrease: false,
//     Distance: 0,
//     EventPoint: {
//       x: 1083893.182,
//       y: 111526.885,
//     },
//     Id: 0,
//     RealignmentDate: "1/1/2019",
//     ReferenceDate: "12/31/2011",
//     ResponseDate: "12/31/2020",
//     Route: "005",
//     RouteGeometry: {
//       __type: "Point:#Wsdot.Geometry.Contracts",
//       spatialReference: {
//         wkid: 2927,
//       },
//       x: 1083893.18192406,
//       y: 111526.88500547409,
//     },
//     Srmp: 0,
//   },
// ];

interface EventPoint {
  x: number;
  y: number;
}

interface PointRouteGeometry extends EventPoint {
  __type: "Point:#Wsdot.Geometry.Contracts";
  spatialReference: {
    wkid: number;
  };
}

type ReturnedDateString = `${number}/${number}/${number}`;

export interface RouteLocation<
  D extends ReturnedDateString | Date = ReturnedDateString,
> {
  Angle: number;
  Arm: number;
  ArmCalcReturnCode: number;
  ArmCalcReturnMessage: string;
  Back: boolean;
  Decrease: boolean;
  Distance: number;
  EventPoint: EventPoint;
  Id: number;
  RealignmentDate: D;
  ReferenceDate: D;
  ResponseDate: D;
  Route: string;
  RouteGeometry: PointRouteGeometry;
  Srmp: number;
}

const reviver: ((this: any, key: string, value: any) => any) | undefined = (
  key,
  value
) => {
  if (
    (key === "RealignmentDate" ||
      key === "ReferenceDate" ||
      key === "ResponseDate") &&
    typeof value === "string"
  ) {
    return new Date(value);
  }
  return value;
};

export async function getNearestRouteLocation(
  options: GetNearestRouteLocationOptions,
  soeUrl: ReturnType<typeof createElcSoeUrl> = createElcSoeUrl()
) {
  const op = "Find Nearest Route Locations";
  const queryUrl = new URL(op, soeUrl);
  for (const [key, value] of enumerateOptionsForSearchParams(options)) {
    queryUrl.searchParams.append(key, value);
  }

  const result = await fetch(queryUrl);
  const json = await result.text();

  const output = JSON.parse(json, reviver) as RouteLocation[];
  return output;
}
