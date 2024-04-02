import call from "../../service/http";
import constants from "./constants";

export default {
  namespaced: true,
  state: {
    settings: [],
  },
  mutations: {
    MUTATE: (state, payload) => {
      state[payload.state] = payload.data;
    },
  },
  getters: {
    adminGetters: (state) => (val) => state[val],
  },
  actions: {
    getSettings: ({ commit }) => {
      commit("SET_LOADING", true, { root: true });
      call("get", constants.settings)
        .then((res) => {
          commit("MUTATE", { state: "settings", data: res.data.data });
          commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },
    storeSettings: ({ commit, dispatch }, payload) => {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.settings, payload)
        .then((res) => {
          commit("MUTATE", { state: "settings", data: res.data.data });
          dispatch("getSettings");
          // commit("SET_LOADING", false, { root: true });
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },
    updateSettings: ({ commit, dispatch }, payload) => {
      commit("SET_LOADING", true, { root: true });
      call("post", constants.update_settings(payload.id), payload.data)
        .then(() => {
          commit("SET_LOADING", false, { root: true });
          dispatch("getSettings");
        })
        .catch((error) => {
          Event.$emit("ApiError", error.response.data.message);
          commit("SET_LOADING", false, { root: true });
        });
    },
  },
};
