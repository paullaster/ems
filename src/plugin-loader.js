import Vue from "vue";

// modules
import Dashboard from "./modules/events";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import ConfirmPlugin from "./plugins/confirmation";

Vue.use(Toast);

const plugins = [
  // modules go here
  Dashboard,
  ConfirmPlugin,
];

const pluginLoader = {
  boot: (args) => {
    let options;
    plugins.forEach((plugin) => {
      try {
        options = {};
        plugin = Array.isArray(plugin) ? plugin : [plugin, options];
        options = typeof plugin[1] === "object" ? plugin[1] : {};
        Vue.use(plugin.shift(), { ...args, ...options });
      } catch (e) {
        console.log("error", e);
      }
    });
  },
};

export default pluginLoader;
