export default {
  events: (no) => `events/${no ? "?no=" + no : ""}`,
  childEvents: `events/child-event`,
  eventMeta: (no) => `events/meta/${no}`,
  setEventMeta: "events/meta/store",
  eventTypes: "events/types",
  cities: "setup/cities",
  counties: "setup/counties",
  countries: "setup/countries",
  disclaimers: "setup/disclaimer",
  membershipCategories: "setup/membership_categories",
  saveDelegate: "events/booking/saveDelegate",
  updateDelegate: "events/booking/updateDelegate",
  exclusion: "events/booking/exclusion",
  billing: "events/booking/billing",
  proforma: (no) => `events/booking/proforma/${no}`,
  receipt: (no) => `events/booking/receipt/${no}`,
  profile: (term) => `profile/search?term=${term}`,
  company: (term) => `company/search?term=${term}`,
  cancelPackage: `events/booking/cancel/package`,
  cancelDelegate: `events/booking/cancel/delegate`,
  cancelBooking: `events/booking/cancel`,
  logos: "events/logos",
  updateBooking: "events/booking/update",
  METADATA: "events/meta",
  disciplines: "setup/disciplines",
  updateBillTo: "events/booking/updateBillTo",
  confirmPayment: `events/booking/confirmPayment`,
  creditReference: "setup/creditReference",
  previousBookings: "events/booking/getPreviousBookings",
  updateBookingCurrency: "events/booking/updateBookingCurrency",
  newEventsAPI: "events",
  booking: "bookings",
  getsingleEvent: (params) => `events/${params}`,
  getBookingDelegates: (params) => `delegates/${params}`,
  getBooking: (params) => `bookings/${params}`,
  delegate: "delegates",
  pay: "pay",
};
