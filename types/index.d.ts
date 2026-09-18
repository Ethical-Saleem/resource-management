export interface Lga {
  id: number;
  name: string;
  lga_code: string;
  geometry: JSON;
  stateId: number;
  state: State;
  lgaResources: LgaResource[];
}

export interface State {
  id: number;
  name: string;
  state_code: string;
  country: string;
  geometry: JSON;
  stateResources: StateResource[];
}

export interface Category {
  id: number;
  name: string;
  abbr: string;
  unitOfMeasurement: string;
}

export interface Resource {
  id: number;
  name: string;
  description: string | null;
  amount: number | null;
  value: number | null;
  quality: string | null;
  colorCode: string;
  image: Buffer | null;
  imageUrl?: string;
  categories: ResourceCategory[];
  lgaResources: LgaResource[];
  stateResources: StateResource[];
}

export interface ResourceCategory {
  id: number;
  resourceId: number;
  categoryId: number;
  category: Category;
}

export interface LgaResource {
  id: number;
  resourceId: number;
  lgaId: number;
  locationLong: number;
  locationLat: number
  resource: Resource;
  lga: Lga;
}

export interface StateResource {
  id: number;
  resourceId: number;
  stateId: number;
  resource: Resource;
  state: State;
}

export type GeoJsonFeature = import('geojson').Feature<
  import('geojson').Geometry,
  import('geojson').GeoJsonProperties
>;

export interface GeoJSONData extends import('geojson').FeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

/** A single point-located resource record, as returned by
 * GET /resource/fetch-map-locations — the shape the map plots directly. */
export interface MapLocation {
  id: number;
  identifier: string;
  lat: number;
  long: number;
  locationName: string | null;
  quantity: string | null;
  quantityRating: number | null;
  estimatedVolumeIndex: number | null;
  value: number | null;
  quality: number | null;
  resourceId: number;
  resourceName: string;
  colorCode: string | null;
  categoryIds: number[];
  lgaId: number;
  lgaName: string;
  stateId: number;
  stateName: string;
}

export type MapScope = 'country' | 'state';
