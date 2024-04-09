import call from "../../service/http";
import { AuthConstants as constant, AuthService } from "./index";

export default {
  namespaced: true,
  state: {
    loading: false,
    company: {},
  },
  mutations: {
    SET_COMPANY: (state, data) => {
      state.company = data;
    },
  },
  getters: {
    user: () => AuthService.user,
    company: (state) => state.company,
  },
  actions: {
    login: (context, data) => {
      context.commit("SET_LOADING", true, { root: true });
      call("post", constant.login, data)
        .then((res) => {
          AuthService.login(res.data.data.token, res.data.data.user);
          Event.$emit("ApiSuccess", "Logged in Successfully");
          context.commit("SET_LOADING", true, { root: false });
          Event.$emit("login-form", false);
        })
        .catch((error) => {
          context.commit("SET_LOADING", true, { root: false });
          Event.$emit(
            "ApiError",
            JSON.parse(error.response.data.message).message
          );
        });
    },
    logout() {
      AuthService.logout();
      Event.$emit("goBack");
    },
    company: (context) => {
      context.commit("SET_LOADING", true, { root: false });
      call("get", constant.company)
        .then((res) => {
          context.commit("SET_COMPANY", res.data.data);
          context.commit("SET_LOADING", false, { root: false });
        })
        .catch(() => {
          Event.$emit("ApiError", "Failed To fetch company info");
          context.commit("SET_LOADING", false, { root: false });
        });
    },

    register: ({ commit }, data) => {
      commit("SET_LOADING", true, { root: true });
      call("post", constant.signup, data)
        .then((res) => {
          Event.$emit("ApiSuccess", "Registered Successfully");
          setTimeout(() => {
            AuthService.login(res.data.data.token, res.data.data.user);
          }, 2000);
          commit("SET_LOADING", false, { root: true });
        })
        .catch((err) => {
          commit("SET_LOADING", false, { root: true });
          console.log(err.response.data.message);
          Event.$emit(
            "ApiError",
            JSON.parse(err.response.data.message).message
          );
        });
    },
  },
};
