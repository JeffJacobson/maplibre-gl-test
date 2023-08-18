export const lrsFeatureServiceUrl = new URL(
  "https://data.wsdot.wa.gov/arcgis/rest/services/Shared/LRSData/FeatureServer/"
);

/**
 * - State Route Increasing (1:24K) (0)
 * - State Route Decreasing (1:24K) (1)
 * - State Route Ramp (1:24K) (2)
 * - State Route Turnbacks (1:24K) (3)
 * - ~~State Route Lines (1:24K) (4)~~
 * - ~~State Route (1:500K) (6)~~
 * - ~~State Route Lines (1:500K) (7)~~
 * - Ferry Terminal and Proposed State Route (8)
 */

export type LayerIdValues = 0 | 1 | 2 | 3 | 8;

export const layerIds: LayerIdValues[] = [0, 1, 2, 3, 8];

export const layerIdMap = new Map<LayerIdValues, string>([
  [0, "Increase"],
  [1, "Decrease"],
  [2, "Ramp"],
  [3, "Turnbacks"],
  [8, "Ferry Terminal and Proposed State Route"],
]);

/**
 * Yields arrays of layer names and URLs
 * @yields - name and URL pairs
 * @example
 * ```ts
 * const map = new Map([...getLayerIdUrls()])
 * ```
 * @see https://developers.arcgis.com/maplibre-gl-js/layers/display-a-popup/
 * @see https://developers.arcgis.com/maplibre-gl-js/layers/add-a-feature-layer-as-geojson/
 */
export function* getLayerIdUrls() {
  for (const [id, name] of layerIdMap) {
    const url = new URL(`${id.toString(10)}/query`, lrsFeatureServiceUrl);
    url.searchParams.set("f", "geojson");
    url.searchParams.set("fields", "*");
    url.searchParams.set("where", "1=1");
    yield [name, url] as [name: string, url: URL];
  }
}
