import Spinner from "./views/Spinner";
import store from "./store";

export default {
  install(Vue, options) {
    options.store.registerModule("Loader", store);
    Vue.component("loader", Spinner);
  },
};
