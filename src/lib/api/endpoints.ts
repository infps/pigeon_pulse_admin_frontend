const authEndpoints = {
  login: "/auth/admin/login",
  logout: "/auth/admin/logout",
  signup: "/auth/admin/signup",
  session: "/auth/admin/session",
};

const schemaEndpoints = {
  getPrizes: "/schema/prizes",
  getPrize: (id: number) => `/schema/prizes/${id}`,
  getFees: "/schema/fees",
  getFee: (id: number) => `/schema/fees/${id}`,
  getBettings: "/schema/bettings",
  getBetting: (id: number) => `/schema/bettings/${id}`,
};

const eventEndpoints = {
  listEvents: "/events/my",
  getEvent: (id: number) => `/events/${id}`,
  createEvent: "/events",
};

const userEndpoints = {
  getProfile: "/users/profile",
  updateProfile: "/users/profile",
  getBreeders: (id: number) => `/users/breeders/event/${id}`,
  getBreedersAddressBook: `/users/breeders`,
  getBreeder: (breederId: number) => `/users/breeders/${breederId}`,
  createBreeder: `/users/breeders`,
  updateBreeder: (breederId: number) => `/users/breeders/${breederId}`,
};

const eventInventoryEndpoints = {
  list: (eventId: number) => `/event-inventory/event/${eventId}`,
  getDetails: (eventInventoryId: number) =>
    `/event-inventory/${eventInventoryId}`,
  updateItem: (id: number) => `/event-inventory/item/${id}`,
};

const birdsEndpoints = {
  listByEvent: (eventId: number) => `/birds/event/${eventId}`,
};

const raceEndpoints = {
  create: "/races",
  listRaces: (eventId: number) => `/races/event/${eventId}`,
  listRace: (raceId: number) => `/races/${raceId}`,
  updateRace: (raceId: number) => `/races/${raceId}`,
  listRaceItems: (raceId: number) => `/races/${raceId}/items`,
  updateRaceItem: (raceId: number, raceItemId: number) =>
    `/races/${raceId}/items/${raceItemId}`,
  listBaskets: (raceId: number) => `/races/${raceId}/baskets`,
  createBasket: (raceId: number) => `/races/${raceId}/baskets`,
  updateBasket: (raceId: number, basketId: number) =>
    `/races/${raceId}/baskets/${basketId}`,
  deleteBasket: (raceId: number, basketId: number) =>
    `/races/${raceId}/baskets/${basketId}`,
  assignBasket: (raceId: number, basketId: number) =>
    `/races/${raceId}/baskets/${basketId}/assign`,
  loftBasketing: (raceId: number) => `/races/${raceId}/item/loft-basket`,
  raceBasketing: (raceId: number) => `/races/${raceId}/item/race-basket`,
  publishResult: (raceId: number) => `/races/${raceId}/publish-result`,
  listResults: (raceId: number) => `/races/${raceId}/results`,
};

export const apiEndpoints = {
  auth: authEndpoints,
  schema: schemaEndpoints,
  events: eventEndpoints,
  birds: birdsEndpoints,
  users: userEndpoints,
  eventInventory: eventInventoryEndpoints,
  races: raceEndpoints,
};
