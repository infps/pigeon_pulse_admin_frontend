type User = {
  name: string | null;
  email: string;
  id: string;
  role: "BREEDER" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "PROSPECT";
};

type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  country: string | null;
  ssn: string | null;
  taxNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  primaryPhone: string | null;
  cellPhone: string | null;
  fax: string | null;
  sms: string | null;
  alternativeEmail: string | null;
  webAddress: string | null;
  status: "ACTIVE" | "INACTIVE" | "PROSPECT";
  createdAt: string;
  updatedAt: string;
};

type PrizeSchema = {
  id: string;
  name: string;
};
type FeeSchema = {
  id: string;
  name: string;
};

type FullFeeSchema = {
  id: string;
  name: string;
  createdById: string;
  entryFee: number;
  expensePercentage: number;
  minEntryFee: number;
  entryFeeRefundable: boolean;
  hs1Fee: number;
  hs2Fee: number;
  hs3Fee: number;
  finalRaceFee: number;
  maxBirds: number;
  maxBackupBirds: number;
  floatingBackup: boolean;
};

type FullPrizeSchema = {
  id: string;
  name: string;
  distributions: {
    fromPosition: number;
    toPosition: number;
    percentage: number;
  }[];
};

type Event = {
  id: string;
  status: "OPEN" | "CLOSED";
  name: string;
  shortName: string;
  date: string;
  type: "AGN" | "AS";
  trainingCount: number;
  inventoryCount: number;
  finalRaceCount: number;
  hotspotCount: number;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  feeSchemaId: string;
  finalRacePrizeSchemaId: string;
  hotspot1PrizeSchemaId: string;
  hotspot2PrizeSchemaId: string;
  hotspot3PrizeSchemaId: string;
  avgWinnerPrizeSchemaId: string;
};

type EventInventory = {
  id: string;
  breeder: {
    id: string;
    name: string | null;
    state: string | null;
  };
  payment: {
    paymentValue: number;
  } | null;
  registration_date: Date;
  reserved_birds: number;
  loft: string;
  isPaid: boolean;
};

type Breeders = {
  id: string;
  email: string;
  name: string | null;
};

type BirdEventInventory = {
  arrivalDate: string | null;
  band: string | null;
  band_1: string | null;
  band_2: string | null;
  band_3: string | null;
  band_4: string | null;
  note: string | null;
  bird: {
    birdName: string;
    breeder: {
      id: string;
      name: string;
    };
    breederId: string;
    color: string;
    createdAt: string;
    id: string;
    imageUrl: string | null;
    is_active: boolean;
    is_lost: boolean;
    lost_date: string | null;
    lost_race_id: string | null;
    sex: "HEN" | "COCK";
    updatedAt: string;
  };
  birdId: string;
  createdAt: string;
  departureDate: string | null;
  eventId: string;
  eventInventoryId: string | null;
  id: string;
  rfId: string | null;
  updatedAt: string;
};

type Race = {
  arrivalDate: string;
  arrivalTemperature: string | null;
  arrivalWeather: string | null;
  arrivalWind: string | null;
  createdAt: string;
  distance: number;
  eventId: string;
  externalRaceId: string;
  id: string;
  isClosed: boolean;
  location: string;
  startTime: string;
  sunrise: string | null;
  sunset: string | null;
  temperature: string | null;
  type:
    | "TRAINING"
    | "INVENTORY"
    | "LOFT_FLY"
    | "PULLING_FLIGHT"
    | "FINAL_RACE"
    | "HOTSPOT_1"
    | "HOTSPOT_2"
    | "HOTSPOT_3"
    | "AVG_WINNER";
  updatedAt: string;
  weather: string | null;
  wind: string | null;
};

type RaceItem = {
  eventInventoryItem: {
    rfId: string | null;
    band: string | null;
    bird: {
      color: string;
      is_lost: boolean;
      breeder: {
        name: string | null;
      };
    };
  };
  loftBasketed: boolean;
  raceBasketed: boolean;
  raceBasketTime: Date | null;
};
type RaceResult = {
  eventInventoryItem: {
    rfId: string | null;
    band: string | null;
    bird: {
      birdName: string;
      color: string;
      breeder: {
        name: string | null;
      };
    };
  };
  raceItemResult: {
    distance: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    raceItemId: string;
    arrivalTime: Date;
    speed: number;
    distanceUnit: string;
    speedUnit: string;
  } | null;
};

type BreederAddressBook = {
  address: string | null;
  alternativeEmail: string | null;
  cellPhone: string | null;
  city: string | null;
  country: string | null;
  createdAt: string;
  email: string;
  fax: string | null;
  id: string;
  name: string;
  primaryPhone: string | null;
  role: string;
  sms: string | null;
  ssn: string | null;
  state: string | null;
  status: "ACTIVE" | "INACTIVE" | "PROSPECT";
  taxNumber: string | null;
  updatedAt: string;
  webAddress: string | null;
  zip: string | null;
};
export type {
  User,
  PrizeSchema,
  FeeSchema,
  FullFeeSchema,
  FullPrizeSchema,
  Event,
  CurrentUser,
  EventInventory,
  Breeders,
  BirdEventInventory,
  Race,
  RaceItem,
  RaceResult,
  BreederAddressBook,
};
