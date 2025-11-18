type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

type CurrentUser = {
  id: string;
  breederNumber: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  isDefaultAddress1: boolean;
  address1: string | null;
  city1: string | null;
  state1: string | null;
  zip1: string | null;
  address2: string | null;
  city2: string | null;
  state2: string | null;
  zip2: string | null;
  phone: string | null;
  cell: string | null;
  fax: string | null;
  email2: string | null;
  webAddress: string | null;
  sms: string | null;
  ssn: string | null;
  taxNumber: string | null;
  statusDate: string | null;
  note: string | null;
  loginName: string | null;
  loginPassword: string | null;
  defaultNameAgn: string | null;
  defaultNameAs: string | null;
  pictureId: string | null;
};

type PrizeSchema = {
  id: string;
  name: string;
};
type FeeSchema = {
  id: string;
  name: string;
};
type BettingSchema = {
  id: string;
  name: string;
};

type FullFeeSchema = {
  id: string;
  name: string;
  createdById: string;
  entryFee: number;
  isRefundable: boolean;
  minEntryFees: number;
  maxBirdCount: number;
  maxBackupBirdCount: number;
  isFloatingBackup: boolean;
  feesCutPercent: number;
  hotSpot1Fee: number;
  hotSpot2Fee: number;
  hotSpot3Fee: number;
  hotSpotFinalFee: number;
  perchFees: {
    birdNo: number;
    perchFee: number;
  }[];
};

type FullPrizeSchema = {
  id: string;
  name: string;
  distributions: {
    fromPosition: number;
    toPosition: number;
    prizeValue: number;
  }[];
};

type Event = {
  name: string;
  date: Date;
  id: string;
  type: "AGN" | "AS";
  bettingSchemeId: string | null;
  feeSchema: {
    entryFee: number;
    hotSpot1Fee: number;
    hotSpot2Fee: number;
    hotSpot3Fee: number;
    hotSpotFinalFee: number;
  };
  _count: {
    eventInventoryItems: number;
  };
  shortName: string;
  isOpen: boolean;
  feeSchemaId: string;
  finalRacePrizeSchemaId: string | null;
  hotspot1PrizeSchemaId: string | null;
  hotspot2PrizeSchemaId: string | null;
  hotspot3PrizeSchemaId: string | null;
  avgWinnerPrizeSchemaId: string | null;
  finalRacePrizeSchema: {
    distributions: {
      fromPosition: number;
      toPosition: number;
      prizeValue: number;
    }[];
  } | null;
  trainingFrom: number;
  trainingTo: number;
  inventoryFrom: number;
  inventoryTo: number;
  finalFrom: number;
  finalTo: number;
  hotspotFrom: number;
  hotspotTo: number;
};

type Breeder = {
  id: string;
  breederNumber: string | null;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string | null;
  isDefaultAddress1: boolean;
  address1: string | null;
  city1: string | null;
  state1: string | null;
  zip1: string | null;
  address2: string | null;
  city2: string | null;
  state2: string | null;
  zip2: string | null;
  phone: string | null;
  cell: string | null;
  fax: string | null;
  email2: string | null;
  webAddress: string | null;
  sms: string | null;
  ssn: string | null;
  taxNumber: string | null;
  status: "ACTIVE" | "INACTIVE" | "PROSPECT";
  statusDate: string | null;
  note: string | null;
  loginName: string | null;
  loginPassword: string | null;
  defaultNameAgn: string | null;
  defaultNameAs: string | null;
  pictureId: string | null;
  createdAt: string;
  updatedAt: string;
};

type EventInventoryPayment = {
  id: string;
  type:
    | "PERCH_FEE"
    | "ENTRY_FEE"
    | "HOTSPOT_FEE_1"
    | "HOTSPOT_FEE_2"
    | "HOTSPOT_FEE_3"
    | "HOTSPOT_FEE_4"
    | "FINAL_RACE_FEE"
    | "OTHER";
  paymentDate: string | null;
  paymentValue: number;
  paymentMethod: string;
  paymentDesc: string | null;
  paymentTimestamp: string | null;
  transactionId: string | null;
  pictureId: string | null;
  eventInventoryId: string;
  breederId: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
};

type EventInventoryItemDetail = {
  id: string;
  eventId: string;
  eventInventoryId: string;
  birdId: string;
  birdNo: number | null;
  arrivalDate: string | null;
  departureDate: string | null;
  perchFeeValue: number;
  entryFeeValue: number;
  entryFeePaid: boolean;
  entryRefund: number | null;
  betsRefund: number | null;
  hotSpotFeeValue: number;
  hotSpotRefund: number | null;
  transferDue: number | null;
  replacedItemId: string | null;
  isBackup: boolean;
  belgianShowBet1: number | null;
  belgianShowBet2: number | null;
  belgianShowBet3: number | null;
  belgianShowBet4: number | null;
  belgianShowBet5: number | null;
  belgianShowBet6: number | null;
  belgianShowBet7: number | null;
  standardShowBet1: number | null;
  standardShowBet2: number | null;
  standardShowBet3: number | null;
  standardShowBet4: number | null;
  standardShowBet5: number | null;
  standardShowBet6: number | null;
  wtaBet1: number | null;
  wtaBet2: number | null;
  wtaBet3: number | null;
  wtaBet4: number | null;
  wtaBet5: number | null;
  isBetActive: boolean;
  createdAt: string;
  updatedAt: string;
  bird: {
    id: string;
    band: string | null;
    band1: string | null;
    band2: string | null;
    band3: string | null;
    band4: string | null;
    birdName: string;
    rfId: string | null;
    color: string;
    sex: "HEN" | "COCK";
    isActive: boolean;
    isRaceVerified: boolean;
    isLost: boolean;
    lostDate: string | null;
    lostRaceId: string | null;
    note: string | null;
    playAttentionSound: boolean;
    pictureId: string | null;
    breederId: string;
    createdAt: string;
    updatedAt: string;
    breeder: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
};

type EventInventory = {
  id: string;
  eventId: string;
  breederId: string;
  signInDate: string | null;
  waitingDate: string | null;
  isWaiting: boolean;
  reservedBirds: number;
  loft: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  breeder: Breeder;
  eventInventoryItems: EventInventoryItemDetail[];
  payments: EventInventoryPayment[];
};

type EventInventoryItem = {
  breeder: {
    firstName: string;
    lastName: string;
  };
  event: {
    name: string;
    date: string;
  };
  eventInventoryItems: (EventInventoryItemDetail & {
    bird: {
      id: string;
      band: string | null;
      band1: string | null;
      band2: string | null;
      band3: string | null;
      band4: string | null;
      birdName: string;
      rfId: string | null;
      color: string;
      sex: "HEN" | "COCK";
      isActive: boolean;
      isRaceVerified: boolean;
      isLost: boolean;
      lostDate: string | null;
      lostRaceId: string | null;
      note: string | null;
      playAttentionSound: boolean;
      pictureId: string | null;
      breederId: string;
      createdAt: string;
      updatedAt: string;
      breeder: {
        id: string;
        firstName: string;
        lastName: string;
      };
    };
  })[];
  loft: string;
  payments: EventInventoryPayment[];
  createdAt: string;
  reservedBirds: number;
};

type Breeders = {
  id: string;
  email: string;
  name: string | null;
};

type BirdEventInventory = {
  id: string;
  eventId: string;
  eventInventoryId: string;
  birdId: string;
  birdNo: number | null;
  arrivalDate: string | null;
  departureDate: string | null;
  perchFeeValue: number;
  entryFeeValue: number;
  entryFeePaid: boolean;
  entryRefund: number | null;
  betsRefund: number | null;
  hotSpotFeeValue: number;
  hotSpotRefund: number | null;
  transferDue: number | null;
  replacedItemId: string | null;
  isBackup: boolean;
  belgianShowBet1: number | null;
  belgianShowBet2: number | null;
  belgianShowBet3: number | null;
  belgianShowBet4: number | null;
  belgianShowBet5: number | null;
  belgianShowBet6: number | null;
  belgianShowBet7: number | null;
  standardShowBet1: number | null;
  standardShowBet2: number | null;
  standardShowBet3: number | null;
  standardShowBet4: number | null;
  standardShowBet5: number | null;
  standardShowBet6: number | null;
  wtaBet1: number | null;
  wtaBet2: number | null;
  wtaBet3: number | null;
  wtaBet4: number | null;
  wtaBet5: number | null;
  isBetActive: boolean;
  createdAt: string;
  updatedAt: string;
  bird: {
    id: string;
    band: string | null;
    band1: string | null;
    band2: string | null;
    band3: string | null;
    band4: string | null;
    birdName: string;
    rfId: string | null;
    color: string;
    sex: "HEN" | "COCK";
    isActive: boolean;
    isRaceVerified: boolean;
    isLost: boolean;
    lostDate: string | null;
    lostRaceId: string | null;
    note: string | null;
    playAttentionSound: boolean;
    pictureId: string | null;
    breederId: string;
    createdAt: string;
    updatedAt: string;
    breeder: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
};

type Race = {
  arrivalTemperature: string | null;
  arrivalWeather: string | null;
  arrivalWind: string | null;
  createdAt: string;
  description: string | null;
  distance: number;
  endTime: string | null;
  eventId: string;
  id: string;
  isClosed: boolean;
  location: string;
  raceNumber: number;
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
  id: string;
  loftBasketed: boolean;
  raceBasketed: boolean;
  raceBasketTime: Date | null;
  isLost: boolean;
  eventInventoryItem: {
    bird: {
      isLost: boolean;
      band: string | null;
      birdName: string;
      rfId: string | null;
      color: string;
      breeder: {
        firstName: string | null;
        lastName: string | null;
      };
    };
  };
  loftBasket: {
    id: string;
    basketNumber: number;
  } | null;
  raceBasket: {
    id: string;
    basketNumber: number;
  } | null;
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

type Basket = {
  id: string;
  raceId: string;
  basketNumber: number;
  capacity: number;
  isRaceBasket: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    raceBasketItems: number;
    loftBasketItems: number;
  };
};

export type {
  User,
  PrizeSchema,
  FeeSchema,
  BettingSchema,
  FullFeeSchema,
  FullPrizeSchema,
  Event,
  CurrentUser,
  EventInventory,
  EventInventoryPayment,
  EventInventoryItemDetail,
  Breeder,
  Breeders,
  BirdEventInventory,
  Race,
  RaceItem,
  RaceResult,
  BreederAddressBook,
  EventInventoryItem,
  Basket,
};
