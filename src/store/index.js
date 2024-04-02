import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { AuthStore } from "../modules/auth";
import store from "../modules/events/store";
import Adminstore from "../modules/admin/store";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: "vuex",
  storage: window.localStorage,
  modules: [""],
});

export default new Vuex.Store({
  state: { loading: false },
  mutations: {
    SET_LOADING: (state, payload) => {
      state.loading = payload;
    },
  },
  getters: {
    loading: (state) => state.loading,
  },
  actions: {},
  modules: {
    Auth: AuthStore,
    Events: store,
    Admin: Adminstore,
  },
  plugins: [vuexLocalStorage.plugin],
});
