type User = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

type CurrentUser = {
  idBreeder: number;
  number: number | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  isDefaultAddress1: number | null;
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
  email: string | null;
  email2: string | null;
  webAddress: string | null;
  sms: string | null;
  socialSecurityNumber: string | null;
  taxNumber: string | null;
  status: number | null;
  statusDate: string | null;
  note: string | null;
  loginName: string | null;
  defNameAgn: string | null;
  defNameAs: string | null;
  idPicture: number | null;
};

type PrizeSchema = {
  idPrizeScheme: number;
  prizeName: string;
};
type FeeSchema = {
  idFeeScheme: number;
  feeSchemeName: string;
};
type BettingSchema = {
  idBettingScheme: number;
  bettingSchemeName: string;
};

type FullFeeSchema = {
  idFeeScheme: number;
  feeSchemeName: string | null;
  entryFee: number | null;
  isRefundable: number | null;
  minEntryFees: number | null;
  maxBirdCount: number | null;
  maxBackupBirdCount: number | null;
  isFloatingBackup: number | null;
  feesCutPercent: number | null;
  hotSpot1Fee: number | null;
  hotSpot2Fee: number | null;
  hotSpot3Fee: number | null;
  hotSpotFinalFee: number | null;
  creatorId: number | null;
  perchFeeItems: {
    birdNo: number | null;
    perchFee: number | null;
  }[];
};

type FullPrizeSchema = {
  idPrizeScheme: number;
  prizeName: string | null;
  creatorId: number | null;
  prizeSchemeItems: {
    fromPosition: number | null;
    toPosition: number | null;
    prizeValue: number | null;
  }[];
};

type Event = {
  idEvent: number;
  eventName: string | null;
  eventShortName: string | null;
  eventDate: string | null;
  eventType: number | null;
  idBettingScheme: number | null;
  idFeeScheme: number | null;
  idFinalPrizeScheme: number | null;
  idHotSpot1PrizeScheme: number | null;
  idHotSpot2PrizeScheme: number | null;
  idHotSpot3PrizeScheme: number | null;
  idHotSpotAvgPrizeScheme: number | null;
  isOpen: number | null;
  creatorId: number | null;
  feeScheme?: {
    entryFee: number | null;
    hotSpot1Fee: number | null;
    hotSpot2Fee: number | null;
    hotSpot3Fee: number | null;
    hotSpotFinalFee: number | null;
    perchFeeItems?: {
      birdNo: number | null;
      perchFee: number | null;
    }[];
  } | null;
  finalPrizeScheme?: {
    prizeSchemeItems: {
      fromPosition: number | null;
      toPosition: number | null;
      prizeValue: number | null;
    }[];
  } | null;
  _count?: {
    eventInventories: number;
  };
};

type Breeder = {
  idBreeder: number;
  number: number | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  isDefaultAddress1: number | null;
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
  email: string | null;
  email2: string | null;
  webAddress: string | null;
  socialSecurityNumber: string | null;
  status: number | null;
  statusDate: string | null;
  note: string | null;
  loginName: string | null;
  loginPassword: string | null;
  idPicture: number | null;
  sms: string | null;
  taxNumber: string | null;
  defNameAgn: string | null;
  defNameAs: string | null;
};

type EventInventoryPayment = {
  idPayment: number;
  idEventInventory: number | null;
  paymentType: number | null;
  paymentDate: string | null;
  paymentValue: number | null;
  paymentMethod: number | null;
  paymentDesc: string | null;
  paymentTimestamp: string | null;
  idPicture: number | null;
};

type EventInventoryItemDetail = {
  idEventInventoryItem: number;
  idEventInventory: number | null;
  idBird: number | null;
  birdNo: number | null;
  arrivalTime: string | null;
  departureDate: string | null;
  perchFeeValue: number | null;
  entryFeeValue: number | null;
  entryFeePaid: number | null;
  entryRefund: number | null;
  betsRefund: number | null;
  hotSpotFeeValue: number | null;
  hotSpotRefund: number | null;
  idReplacedItem: number | null;
  isBackup: number | null;
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
  isBetActive: number | null;
  transferDue: number | null;
  bird?: {
    idBird: number;
    band: string | null;
    band1: string | null;
    band2: string | null;
    band3: string | null;
    band4: string | null;
    birdName: string | null;
    rfId: string | null;
    color: string | null;
    sex: number | null;
    isActive: number | null;
    isRaceVerified: number | null;
    isLost: number | null;
    lostDate: string | null;
    lostIdRace: number | null;
    note: string | null;
    playAttentionSound: number | null;
    idPicture: number | null;
    breederId: number | null;
    breeder?: {
      idBreeder: number;
      firstName: string | null;
      lastName: string | null;
    };
  };
};

type EventInventory = {
  idEventInventory: number;
  idEvent: number | null;
  idBreeder: number | null;
  signInDate: string | null;
  waitingDate: string | null;
  isWaiting: number | null;
  reservedBirds: number | null;
  loft: string | null;
  note: string | null;
  breeder?: Breeder;
  eventInventoryItems?: EventInventoryItemDetail[];
  payments?: EventInventoryPayment[];
};

type EventInventoryItem = {
  breeder?: {
    firstName: string | null;
    lastName: string | null;
  };
  event?: {
    eventName: string | null;
    eventDate: string | null;
  };
  eventInventoryItems?: EventInventoryItemDetail[];
  loft: string | null;
  payments?: EventInventoryPayment[];
  reservedBirds: number | null;
};

type Breeders = {
  idBreeder: number;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

type BirdEventInventory = {
  idEventInventory:number;
  idEvent:number | null;
  idBreeder:number | null;
  signInDate:string | null;
  waitingDate:string | null;
  isWaiting:number | null;
  reservedBirds:number | null;
  loft:string | null;
  note:string | null;
  eventInventoryItems?: EventInventoryItems[];
};

type EventInventoryItems = {
  idEventInventoryItem: number;
  idEventInventory: number | null;
  idBird: number | null;
  birdNo: number | null;
  arrivalTime: string | null;
  departureDate: string | null;
  perchFeeValue: number | null;
  entryFeeValue: number | null;
  entryFeePaid: number | null;
  entryRefund: number | null;
  betsRefund: number | null;
  hotSpotFeeValue: number | null;
  hotSpotRefund: number | null;
  idReplacedItem: number | null;
  isBackup: number | null;
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
  isBetActive: number | null;
  transferDue: number | null;
  bird?: {
    idBird: number;
    band: string | null;
    band1: string | null;
    band2: string | null;
    band3: string | null;
    band4: string | null;
    birdName: string | null;
    rfId: string | null;
    color: string | null;
    sex: number | null;
    isActive: number | null;
    isRaceVerified: number | null;
    isLost: number | null;
    lostDate: string | null;
    lostIdRace: number | null;
    note: string | null;
    playAttentionSound: number | null;
    idPicture: number | null;
    breederId: number | null;
    breeder?: {
      idBreeder: number;
      firstName: string | null;
      lastName: string | null;
    };
  };
};

type Race = {
  idRace: number;
  idRaceType: number | null;
  raceNumber: number | null;
  idEvent: number | null;
  location: string | null;
  description: string | null;
  distance: number | null;
  startTime: string | null;
  endTime: string | null;
  sunrise: string | null;
  sunset: string | null;
  isClosed: number | null;
  weather: string | null;
  wind: string | null;
  temperature: string | null;
  arrivalWeather: string | null;
  arrivalWind: string | null;
  arrivalTemperature: string | null;
  stats?: {
    totalBirds: number;
    basketed: number;
    arrived: number;
    notArrived: number;
    lost: number;
  };
};

type RaceItem = {
  idRaceItem: number;
  idRace: number | null;
  idInventoryItem: number | null;
  idDistBasket: number | null;
  idRaceBasket: number | null;
  isDistBasketted: number | null;
  isLost: number | null;
  lostIdRace: number | null;
  raceBasketTime: string | null;
  inventoryItem?: {
    bird?: {
      isLost: number | null;
      band: string | null;
      birdName: string | null;
      rfId: string | null;
      color: string | null;
      breeder?: {
        firstName: string | null;
        lastName: string | null;
      };
    };
  };
  distBasket?: {
    idBasket: number;
    basketNo: number | null;
  } | null;
  raceBasket?: {
    idBasket: number;
    basketNo: number | null;
  } | null;
};
type RaceResult = {
  inventoryItem?: {
    bird?: {
      rfId: string | null;
      band: string | null;
      birdName: string | null;
      color: string | null;
      breeder?: {
        firstName: string | null;
        lastName: string | null;
      };
    };
  };
  raceItemResult?: {
    idRaceItem: number;
    birdPosition: number | null;
    birdPositionHotSpot: number | null;
    arrivalTime: string | null;
    birdDrop: number | null;
    prizeValue: number | null;
  } | null;
};

type BreederAddressBook = {
  idBreeder: number;
  number: number | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  isDefaultAddress1: number | null;
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
  email: string | null;
  email2: string | null;
  webAddress: string | null;
  socialSecurityNumber: string | null;
  status: number | null;
  statusDate: string | null;
  note: string | null;
  loginName: string | null;
  idPicture: number | null;
  sms: string | null;
  taxNumber: string | null;
  defNameAgn: string | null;
  defNameAs: string | null;
};

type Basket = {
  idBasket: number;
  idRace: number | null;
  basketNo: number | null;
  capacity: number | null;
  isRaceBasket: number | null;
  _count?: {
    raceBasketItems: number;
    distBasketItems: number;
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
