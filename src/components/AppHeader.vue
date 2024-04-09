<template>
  <v-app-bar color="primary">
    <div class="mr-2">
      <v-avatar size="50">
        <v-img
          contain
          :src="`data:application/jpg;base64,${company.base64Logo}`"
        />
      </v-avatar>
    </div>
    <v-toolbar-title
      @click="$router.push('/')"
      class="text-lg-h5 font-weight-black white--text ml-4"
      style="cursor: pointer"
    >
      <span class="mr-2">{{ company.displayName }}</span>
      EVENTS MANAGEMENT SYSTEM</v-toolbar-title
    >
    <v-spacer />
    <!-- <v-btn class="primary mx-2" text v-if="check" link @click="goToBookingList"
      >Click to View My Bookings</v-btn
    > -->
    <v-btn class="primary mx-2" text link @click="goToCreateEvent" v-if="check"
      >Create event</v-btn
    >
    <span v-if="check" class="overline mr-4 h4 white--text"
      >Welcome {{ user.name }}</span
    >
    <v-btn v-if="check" color="white" text @click="logout">Logout</v-btn>
    <!-- <login /> -->
  </v-app-bar>
</template>
<script>
import { AuthService } from "../modules/auth";
// import Login from "../modules/auth/views/Login";

export default {
  name: "AppHeader",
  // components: { Login },
  mounted() {
    document.onkeydown = (e) => {
      if (e.ctrlKey === true && e.keyCode === 76) {
        e.preventDefault();
        console.log("ctrl + l was hit ....");
        this.login();
      }
    };
    Event.$on("goBack", () => {
      this.$router.push({ name: "EventList" });
    });
  },
  computed: {
    user() {
      return AuthService.user;
    },
    check() {
      return AuthService.check();
    },
    company() {
      return this.$store.getters["Auth/company"];
    },
  },
  methods: {
    login: function () {
      Event.$emit("login-form", true);
    },
    logout: function () {
      this.$store.dispatch("Auth/logout", {
        id: AuthService.user.id,
      });
    },
    goToBookingList: function () {
      this.$router.push({ name: "BookingList" });
    },
    goToCreateEvent() {
      this.$router.push({ name: "CreateEvent" });
    },
  },
};
</script>
