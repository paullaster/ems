<template>
  <div>
    <AppHeader />
    <router-view name="action"></router-view>
    <router-view name="view"></router-view>
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      style="margin-bottom: 3%"
      color="primary"
      @click="toTop"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
    <AppFooter />
    <spinner />
    <confirmation-modal />
  </div>
</template>
<script>
import AppHeader from "./AppHeader.vue";
import AppFooter from "./AppFooter.vue";
import Spinner from "../plugins/loader/views/Spinner";
export default {
  name: "AppLayout",
  components: { Spinner, AppHeader, AppFooter },
  data: function () {
    return {
      fab: false,
    };
  },
  // beforeRouteEnter(to, from, next) {
  //   next((v) => {
  //     // v.$store.dispatch("Auth/company");
  //     // v.$store.dispatch("Admin/getSettings");
  //   });
  // },
  computed: {
    // settings() {
    //   return this.$store.getters["Admin/adminGetters"]("settings");
    // },
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    setLocalStorage() {
      return window.localStorage.setItem(
        "aquila_captions",
        JSON.stringify(this.settings ? JSON.parse(this.settings.captions) : {})
      );
    },
  },
  watch: {
    settings() {
      this.setLocalStorage();
    },
  },
};
</script>
