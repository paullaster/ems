import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#9f232d",
        secondary: "#f5852c",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        BackTheme: "#E5E7E9",
        BadgeTheme: "#FFD700",
        cpdBadge: "#ff0000",
      },
    },
  },
  icons: {
    iconfont: "md",
  },
});