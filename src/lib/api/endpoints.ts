const dashboardEndpoints = {
  base: "/dashboard",
};

const userEndpoints = {
  base: "/users",
  getSingleUser: (userId: string) => `/users/${userId}`,
  getUserSummary: (userId: string) => `/users/summary/${userId}`,
  updateUser: (userId: string) => `/users/${userId}`,
  getBirdsbyUserId: (userId: string) => `/users/birds/${userId}`,
  getRacesJoined: (userId: string) => `/users/races/${userId}`,
  getWins: (userId: string) => `/users/wins/${userId}`,
  getPayments: (userId: string) => `/users/payments/${userId}`,
};

const racesEndpoints = {
  base: "/races",
  createRace: "/races/create",
  updateRace: (raceId: string) => `/races/update/${raceId}`,
  getSingleRace: (raceId: string) => `/races/${raceId}`,
};

const paymentsEndpoints = {
  base: "/payments",
};

const raceStatsEndpoints = {
  base: "/race-stats",
  getRaceStats: (raceId: string) => `/race-stats/${raceId}`,
};
export const apiEndpoints = {
  dashboardEndpoints,
  userEndpoints,
  racesEndpoints,
  paymentsEndpoints,
  raceStatsEndpoints,
};
