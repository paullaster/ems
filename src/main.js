import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import { router } from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { filters } from "./utilities";
import { listener, RouteMixin } from "./mixins";
import loader from "./plugin-loader";

import "material-design-icons-iconfont/dist/material-design-icons.css";
import "nprogress/nprogress.css";
import VueEllipseProgress from "vue-ellipse-progress";

import VueTelInput from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";

import confirmation from "./plugins/confirmation";

/** import paygate package */
import paygate from "@kinetics254/paygate";

store.router = router;
loader.boot({ router, store });

//VUETELINPUT GLOBAL OPTIONS
const globalOptions = {};

// eslint-disable-next-line no-global-assign
Event = new Vue();

filters.forEach((f) => {
  Vue.filter(f.name, f.execute);
});

Vue.use(VueEllipseProgress);
Vue.config.productionTip = false;

Vue.use(paygate.paygateCheckout, { store });
Vue.use(paygate.appCheckoutAlert);

Vue.use(VueTelInput, globalOptions);

Vue.use(confirmation);

// eslint-disable-next-line no-new
new Vue({
  router,
  store,
  mixins: [listener, RouteMixin],
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
