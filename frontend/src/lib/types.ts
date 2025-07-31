type User = {
  name: string | null;
  email: string;
  id: string;
  role: "BREEDER" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "PROSPECT";
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

export type { User, PrizeSchema, FeeSchema, FullFeeSchema, FullPrizeSchema };
