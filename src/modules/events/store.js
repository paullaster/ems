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
    paymentDialog: false,
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
    SET_DELEGATES: (state, payload) => {
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
    SET_PAYMENT_DIALOG: (state, payload) => {
      state.paymentDialog = payload;
    }
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
    delegates: (state) => state.delegates,
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
    paymentDialog: (state) => state.paymentDialog,
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
    saveBooking({ commit }, payload) {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.booking, payload)
        .then((res) => {
          commit("SET_LOADING", false, { root: true });
          // dispatch("saveDelegate", { ...args, booking: res.data.data.id });
          this.router.push({
            name: "booking",
            params: { no: res.data.data.id },
          });
        })
        .catch((error) => {
          commit("SET_LOADING", false, { root: true });
          Event.$emit("ApiError", error.response.data.message);
        });
    },
    saveDelegate(context, data) {
      context.commit("SET_LOADING", true, { root: true });
      call("post", constants.delegate, data)
        .then((res) => {
          context.commit("SET_LOADING", false, { root: true });
          context.dispatch("getBooking", res.data.data.booking);
          Event.$emit("ApiSuccess", res.data.message);
        })
        .catch((error) => {
          context.commit("SET_LOADING", false, { root: true });
          Event.$emit("ApiError", error.response.data.message);
        });
    },

    getBookingDelegates(context, params) {
      call("get", constants.getBookingDelegates(params))
        .then((res) => {
          context.commit("SET_DELEGATES", res.data.data);
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
        });
    },

    getBooking: ({ commit, dispatch }, no) => {
      commit("SET_LOADING", true, { root: true });
      call("get", constants.getBooking(no))
        .then((res) => {
          commit("SET_BOOKING", res.data.data);
          dispatch("getBookingDelegates", res.data.data.id);
          dispatch("getEvent", res.data.data.event);
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
    createEvent({ commit }, payload) {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.newEventsAPI, payload)
        .then((res) => {
          console.assert(res);
          commit("SET_LOADING", false, { root: true });
          Event.$emit("ApiSuccess", res.data.message);
          this.router?.push({ path: "/events" });
        })
        .catch((error) => {
          console.error(error);
          Event.$emit(
            "ApiError",
            "Sorry, We ran into an error creating event."
          );
          commit("SET_VALIDATING", false);
          commit("SET_LOADING", false, { root: true });
        });
    },
    pay({ commit, dispatch }, payload) {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.pay, payload)
        .then((res) => {
          commit("SET_LOADING", false, { root: true });
          dispatch("getBooking", payload.bookingNo);
          Event.$emit("ApiSuccess", res.data.message);
        })
        .catch((error) => {
          commit("SET_LOADING", false, { root: true });
          Event.$emit("ApiError", error.response.data.message);
        });
    }
  },
};
