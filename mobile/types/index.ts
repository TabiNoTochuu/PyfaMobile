/** TypeScript interfaces mirroring the FastAPI Pydantic models */

// ---------------------------------------------------------------------------
// Fits
// ---------------------------------------------------------------------------

export interface FitLite {
  fitID: number;
  name: string;
  shipTypeID: number;
  shipName: string;
  shipClass?: string;
  characterName?: string;
  notes?: string;
  iconURL?: string;
}

export interface ModuleOut {
  typeID: number;
  typeName: string;
  slot: 'high' | 'mid' | 'low' | 'rig' | 'subsystem';
  position: number;
  state: 'offline' | 'online' | 'active' | 'overload';
  chargeTypeID?: number;
  chargeTypeName?: string;
  iconURL?: string;
}

export interface DroneOut {
  typeID: number;
  typeName: string;
  count: number;
  activeCount: number;
  iconURL?: string;
}

export interface ImplantOut {
  typeID: number;
  typeName: string;
  slot: number;
  iconURL?: string;
}

export interface BoosterOut {
  typeID: number;
  typeName: string;
  slot: number;
  iconURL?: string;
}

export interface FitFull extends FitLite {
  highSlots: (ModuleOut | null)[];
  midSlots: (ModuleOut | null)[];
  lowSlots: (ModuleOut | null)[];
  rigSlots: (ModuleOut | null)[];
  subsystemSlots: (ModuleOut | null)[];
  drones: DroneOut[];
  implants: ImplantOut[];
  boosters: BoosterOut[];
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface ResistProfile {
  hp: number;
  em: number;
  therm: number;
  kin: number;
  exp: number;
}

export interface EhpBreakdown {
  uniform: number;
  em: number;
  therm: number;
  kin: number;
  exp: number;
}

export interface TankStats {
  shield: ResistProfile;
  armor: ResistProfile;
  hull: ResistProfile;
  ehp: EhpBreakdown;
  effectivehp: number;
}

export interface DpsStats {
  turret: number;
  missile: number;
  drone: number;
  total: number;
  volley: number;
}

export interface CapStats {
  stable: boolean;
  stableAt?: number;
  timeToEmpty?: number;
  capacity: number;
  rechargeRate: number;
}

export interface NavigationStats {
  maxVelocity: number;
  agility: number;
  alignTime: number;
  warpSpeed: number;
  signatureRadius: number;
}

export interface SensorStrength {
  type: string;
  value: number;
}

export interface TargetingStats {
  maxTargetRange: number;
  scanResolution: number;
  maxLockedTargets: number;
  sensorStrength: SensorStrength;
}

export interface ResourceUsage {
  used: number;
  total: number;
}

export interface FittingResources {
  cpu: ResourceUsage;
  powergrid: ResourceUsage;
  calibration: ResourceUsage;
  droneBandwidth: ResourceUsage;
  droneBay: ResourceUsage;
}

export interface PriceStats {
  hull: number;
  fit: number;
  total: number;
}

export interface FullStats {
  fitID: number;
  shipName: string;
  shipTypeID: number;
  validation: { valid: boolean; issues: string[] };
  tank: TankStats;
  dps: DpsStats;
  capacitor: CapStats;
  navigation: NavigationStats;
  targeting: TargetingStats;
  fitting: FittingResources;
  price: PriceStats;
}

// ---------------------------------------------------------------------------
// Ships & Market
// ---------------------------------------------------------------------------

export interface ShipLite {
  typeID: number;
  name: string;
  groupID: number;
  groupName: string;
  raceID?: number;
  raceName?: string;
  iconURL?: string;
  renderURL?: string;
}

export interface ItemLite {
  typeID: number;
  name: string;
  groupID: number;
  groupName: string;
  metaLevel?: number;
  slot?: string;
  iconURL?: string;
}

export interface AttributeOut {
  attributeID: number;
  name: string;
  displayName?: string;
  value: number;
  unit?: string;
  highIsGood?: boolean;
}

export interface ItemFull extends ItemLite {
  description?: string;
  attributes: AttributeOut[];
  variations: ItemLite[];
}

// ---------------------------------------------------------------------------
// Characters
// ---------------------------------------------------------------------------

export interface CharacterLite {
  characterID: number;
  name: string;
  isESI: boolean;
  isBuiltin: boolean;
}

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

export type ModuleState = 'offline' | 'online' | 'active' | 'overload';
