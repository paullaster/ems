import call from "../../service/http";
import constants from "./constants";

export default {
  namespaced: true,
  state: {
    events: [],
    eventsTypes: [],
    booking: {},
    proforma: "",
    receipt: "",
    counties: [],
    countries: [],
    cities: [],
    disclaimers: [],
    profile: {},
    company: {},
    loadingSearch: false,
    validating: false,
    meta: {
      eventNo: "",
      excerpt: "",
      gpsCoordinates: "",
      image: "",
      contact_person: "",
      phone: "",
      email: "",
    },
    metadata: [],
    eventDelegate: [],
    event: {},
    childEvent: [],
    delegateForm: [],
    displaySelectedAmount: 0,
    disciplines: [],
    sponsors: [
      "sponsor1.jpg",
      "sponsor6.jpg",
      "sponsor2.jpg",
      "sponsor3.jpg",
      "sponsor4.jpg",
      "sponsor5.jpg",
    ],
    creditReferenceData: {},
    creditReference: [],
    membershipCategories: [],
    billingCacheData: {},
    previousBookings: [],
  },
  mutations: {
    SET_EVENTS: (state, payload) => {
      state.events = payload;
    },
    SET_METADATA: (state, payload) => {
      state.metadata = payload;
    },
    SET_META: (state, payload) => {
      if (payload) {
        state.meta = payload;
      }
    },
    SET_EVENT_TYPES: (state, payload) => {
      state.eventsTypes = payload;
    },
    SET_PROFILE: (state, payload) => {
      state.profile = payload;
    },
    SET_COMPANY: (state, payload) => {
      state.company = payload;
    },
    SET_COUNTIES: (state, payload) => {
      state.counties = payload;
    },
    SET_CITIES: (state, payload) => {
      state.cities = payload;
    },
    SET_DISCLAIMERS: (state, payload) => {
      state.disclaimers = payload;
    },
    SET_PROFORMA: (state, payload) => {
      state.proforma = payload;
    },
    SET_RECEIPT: (state, payload) => {
      state.receipt = payload;
    },
    ADD_DELEGATE: (state, payload) => {
      const delegateExists = state.eventDelegate.find((el) => {
        if (el.delegateType === "Member") {
          return el.memberNo === payload.memberNo;
        } else {
          return el.idNo === payload.idNo;
        }
      });
      if (delegateExists === undefined) {
        state.eventDelegate.find((el) => el.pdelegate) !== undefined
          ? (payload.pdelegate = false)
          : (payload.pdelegate = true);
        state.eventDelegate.push(payload);
      } else {
        state.eventDelegate[state.eventDelegate.indexOf(delegateExists)] =
          payload;
      }
    },
    SET_DELEGATE: (state, payload) => {
      state.eventDelegate = payload;
    },
    UPDATE_DELEGATE: (state, payload) => {
      state.eventDelegate.find((el) => el.pdelegate) !== undefined
        ? (payload.pdelegate = false)
        : (payload.pdelegate = true);
      state.eventDelegate[payload.index] = payload.delegate;
    },
    REMOVE_DELEGATE: (state, index) => {
      state.eventDelegate.splice(index, 1);
    },
    SET_BOOKING: (state, payload) => {
      state.booking = payload;
    },
    SET_EVENT: (state, payload) => {
      state.event = payload;
    },
    //set related Event
    SET_RELATED_EVENT: (state, payload) => {
      state.childEvent = payload;
    },

    SET_COUNTRIES: (state, payload) => {
      state.countries = payload;
    },
    SET_DELEGATE_FORM: (state, payload) => {
      state.delegateForm = payload;
    },
    SET_LOADING_SEARCH: (state, payload) => {
      state.loadingSearch = payload;
    },
    SET_VALIDATING: (state, payload) => {
      state.validating = payload;
    },
    SET_SELECTED_AMOUNT: (state, payload) => {
      state.displaySelectedAmount = payload;
    },
    SET_DISCIPLINES: (state, payload) => {
      state.disciplines = payload;
    },
    SET_CREDIT_REFERENCE_DATA: (state, payload) => {
      state.creditReferenceData = payload;
    },
    SET_CREDIT_REFERENCE: (state, payload) => {
      state.creditReference = payload;
    },
    SET_MEMBERSHIP_CATEGORIES: (state, payload) => {
      state.membershipCategories = payload;
    },
    CLEAR_EVENT_DELEGATE: (state) => {
      state.eventDelegate = [];
    },
    SET_BILLING_CACHE_DATA: (state, payload) => {
      state.billingCacheData = payload;
    },
    SET_PREVIOUS_BOOKINGS: (state, payload) => {
      state.previousBookings = payload;
    },
  },
  getters: {
    events: (state) => state.events,
    meta: (state) => state.meta,
    metadata: (state) => state.metadata,
    eventsTypes: (state) => state.eventsTypes,
    profile: (state) => state.profile,
    company: (state) => state.company,
    counties: (state) => state.counties,
    cities: (state) => state.cities,
    disclaimers: (state) => state.disclaimers,
    eventDelegate: (state) => state.eventDelegate,
    booking: (state) => state.booking,
    proforma: (state) => state.proforma,
    receipt: (state) => state.receipt,
    event: (state) => state.event,
    countries: (state) => state.countries,
    sponsors: (state) => state.sponsors,
    delegateForm: (state) => state.delegateForm,
    loadingSearch: (state) => state.loadingSearch,
    validating: (state) => state.validating,
    displaySelectedAmount: (state) => state.displaySelectedAmount,
    disciplines: (state) => state.disciplines,
    creditReferenceData: (state) => state.creditReferenceData,
    creditReference: (state) => state.creditReference,
    membershipCategories: (state) => state.membershipCategories,
    billingCacheData: (state) => state.billingCacheData,
    previousBookings: (state) => state.previousBookings,
    childEvent: (state) => state.childEvent,
  },
  actions: {
    getEvents: (context) => {
      context.commit("SET_LOADING", true, { root: true });
      call("get", constants.newEventsAPI)
        .then((res) => {
          context.commit("SET_EVENTS", res.data.data);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    getEvent: (context, no) => {
      context.commit("SET_LOADING", true, { root: true });
      call("get", constants.getsingleEvent(no))
        .then((res) => {
          context.commit("SET_EVENT", res.data.data);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    //get child|sub|related Event
    getRelatedEvent: ({ commit }, payload) => {
      console.log("payload", payload);
      commit("SET_LOADING", true, { root: true });
      call("post", constants.childEvents, payload)
        .then((res) => {
          commit("SET_RELATED_EVENT", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    getEventTypes: (context) => {
      context.commit("SET_LOADING", true, { root: true });
      call("get", constants.eventTypes)
        .then((res) => {
          context.commit("SET_EVENT_TYPES", res.data.data);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    getAllMeta: (context) => {
      context.commit("SET_LOADING", true, { root: true });
      call("get", constants.METADATA)
        .then((res) => {
          context.commit("SET_METADATA", res.data.data);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    getEventMeta: (context, eventNo) => {
      context.commit("SET_LOADING", true, { root: true });
      call("get", constants.eventMeta(eventNo))
        .then((res) => {
          context.commit("SET_META", res.data.data);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    setEventMeta: (context, meta) => {
      context.commit("SET_LOADING", true, { root: true });
      call("post", constants.setEventMeta, meta)
        .then((res) => {
          context.commit("SET_META", res.data.data);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    searchCompany: (context, term) => {
      context.commit("SET_LOADING", true, { root: true });
      call("get", constants.company(term))
        .then((res) => {
          context.commit("SET_COMPANY", res.data.data[0]);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    getCities: ({ commit, state }) => {
      if (state.cities.length > 0) return;

      commit("SET_LOADING", true, { root: true });
      call("get", constants.cities)
        .then((res) => {
          commit("SET_CITIES", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    getCounties: ({ commit, state }) => {
      if (state.counties.length > 0) return;
      commit("SET_LOADING", true, { root: true });
      call("get", constants.counties)
        .then((res) => {
          commit("SET_COUNTIES", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    getDisclaimers: ({ commit, state }) => {
      if (state.disclaimers.length > 0) return;
      commit("SET_LOADING", true, { root: true });
      call("get", constants.disclaimers)
        .then((res) => {
          commit("SET_DISCLAIMERS", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    setPrimaryDelegate: (context, billTo) => {
      context.commit("SET_LOADING", true, { root: true });
      call("post", constants.updateBillTo, billTo)
        .then((res) => {
          context.commit("SET_LOADING", false, { root: true });
          context.dispatch("getBooking", billTo.bookingNo);
          Event.$emit("ApiSuccess", res.data.message);
        })
        .catch((error) => {
          context.commit("SET_LOADING", false, { root: true });
          Event.$emit("ApiError", error.response.data.message);
        });
    },

    saveDelegate: (context, data) => {
      context.commit("SET_VALIDATING", true);
      call("post", constants.saveDelegate, data)
        .then((res) => {
          context.commit("CLEAR_EVENT_DELEGATE");
          if (data.type === "close") {
            context.commit("SET_LOADING", true, { root: true });
            Event.$emit("saveBooking", res.data.data);
          } else {
            Event.$emit("saveBookingClear", res.data.data);
            context.dispatch("getBooking", res.data.data.bookingNo);
          }
          context.dispatch("updateBookingCurrency", {
            bookingNo: res.data.data.bookingNo,
            eventNo: res.data.data.eventNo,
            currencyCode: data.currencyCode,
          });
          Event.$emit("ApiSuccess", "successfully added delegate");
          context.commit("SET_VALIDATING", false);
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_VALIDATING", false);
        });
    },

    updateDelegate: (context, data) => {
      context.commit("SET_VALIDATING", true);
      call("post", constants.updateDelegate, data)
        .then((res) => {
          context.commit("CLEAR_EVENT_DELEGATE");
          Event.$emit("saveBooking", res.data.data);
          context.dispatch("getBooking", res.data.data.bookingNo);
          context.commit("SET_VALIDATING", false);
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_VALIDATING", false);
        });
    },

    saveBilling: (context, billing) => {
      context.commit("SET_LOADING", true, { root: true });
      call("post", constants.billing, billing)
        .then((res) => {
          context.commit("SET_LOADING", false, { root: true });
          context.commit("SET_CREDIT_REFERENCE_DATA", res.data.data[0]);
          Event.$emit("billing-saved", billing.checkout);
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    getBooking: ({ commit }, no) => {
      commit("SET_LOADING", true, { root: true });
      call("get", constants.getBooking(no))
        .then((res) => {
          if (res.data.data[0]) {
            commit("SET_BOOKING", res.data.data[0]);
            res.data.data[0].eventDelegate.map((d) => {
              if (d.status !== "Cancelled") {
                commit("ADD_DELEGATE", d);
              }
            });
          }
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    getProforma: (context, no) => {
      context.commit("SET_LOADING", true, { root: true });
      call("get", constants.proforma(no))
        .then((res) => {
          context.commit("SET_PROFORMA", res.data.data[0]);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    getReceipt: (context, no) => {
      context.commit("SET_LOADING", true, { root: true });
      call("get", constants.receipt(no))
        .then((res) => {
          context.commit("SET_RECEIPT", res.data.data[0]);
          context.commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          context.commit("SET_LOADING", false, { root: true });
        });
    },

    cancelPackage: ({ commit, dispatch }, payload) => {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.cancelPackage, payload)
        .then(() => {
          dispatch("getBooking", payload.bookingNo);
          Event.$emit("ApiSuccess", "Package Removed Successfully");
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    cancelDelegate: ({ commit, dispatch }, payload) => {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.cancelDelegate, payload)
        .then(() => {
          commit("REMOVE_DELEGATE", payload.index);
          dispatch("getBooking", payload.bookingNo);
          Event.$emit("ApiSuccess", "Delegate Removed Successfully");
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    cancelBooking: ({ commit, dispatch }, payload) => {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.cancelBooking, payload)
        .then(() => {
          dispatch("getBooking", payload.bookingNo);
          Event.$emit("ApiSuccess", "Booking Removed Successfully");
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    getCountries: ({ commit }) => {
      commit("SET_LOADING", true, { root: true });
      call("get", constants.countries)
        .then((res) => {
          commit("SET_COUNTRIES", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    setDelegateForm: ({ commit }, payload) => {
      commit("SET_DELEGATE_FORM", payload);
    },

    getDisciplines: ({ commit }) => {
      commit("SET_LOADING", true, { root: true });
      call("get", constants.disciplines)
        .then((res) => {
          commit("SET_DISCIPLINES", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    confirmPayment: ({ commit }, payload) => {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.confirmPayment, payload)
        .then(() => {
          Event.$emit("viewBooking", payload.bookingNo);
          Event.$emit("ApiSuccess", "Payment Confirmed Successfully");
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    getCreditReferenceData: ({ commit }) => {
      commit("SET_LOADING", true, { root: true });
      call("get", constants.creditReference)
        .then((res) => {
          commit("SET_CREDIT_REFERENCE", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },

    getMembershipCategories: ({ commit }) => {
      commit("SET_LOADING", true, { root: true });
      call("get", constants.membershipCategories)
        .then((res) => {
          commit("SET_MEMBERSHIP_CATEGORIES", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },
    saveBillingCacheData: ({ commit }, payload) => {
      commit("SET_BILLING_CACHE_DATA", payload);
    },

    getPreviousBookings: ({ commit }, payload) => {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.previousBookings, payload)
        .then((res) => {
          commit("SET_PREVIOUS_BOOKINGS", res.data.data);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          commit("SET_LOADING", false, { root: true });
          Event.$emit("ApiError", error.response.data.message);
        });
    },
  },
};
