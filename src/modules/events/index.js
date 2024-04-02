import routes from "./routes";
// import store from "./store";

export default {
  install(Vue, options) {
    /* register store and routes */
    options.router.addRoute(...routes);

    // Register store directly For persisting
    // options.store.registerModule("Events", store);
  },
};
