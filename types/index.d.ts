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
  colorCode: string | null;
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
