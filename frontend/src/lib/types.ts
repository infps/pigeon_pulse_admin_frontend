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
};
