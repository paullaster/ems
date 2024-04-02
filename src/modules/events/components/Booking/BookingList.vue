<template>
  <v-container>
    <v-card flat>
      <v-card-title>
        Previous Booked Events
        <v-spacer />
        <v-btn color="primary" text @click="viewEvents">
          View Events
          <v-icon right small> mdi-arrow-right </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-data-table
          :headers="headers"
          :items="bookings"
          dense
          class="elevation-1"
        >
          <template v-slot:item.paid="{ item }">
            <span :class="item.paid ? 'green--text' : 'error--text'">
              {{ item.paid ? "paid" : "not paid" }}
            </span>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip
              label
              small
              :color="`${bookingStatusColor(item.status)} lighten-5`"
              :class="`${bookingStatusColor(
                item.status
              )}--text text--darken-4 text-capitlize`"
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="item.isActive"
              outlined
              x-small
              color="secondary"
              @click="viewBooking(item)"
              target="_blank"
            >
              view
              <v-icon color="secondary" right small> mdi-arrow-right </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { AuthService } from "@/modules/auth";
import { helper } from "@/utilities";
export default {
  name: "BookingList",
  data: function () {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    next((v) => {
      if (AuthService.check())
        v.$store.dispatch("Events/getPreviousBookings", {
          user: AuthService.user,
        });
    });
  },
  computed: {
    bookings() {
      return this.$store.getters["Events/previousBookings"];
    },
    headers() {
      return [
        { text: "No", value: "bookingNo" },
        { text: "Event No.", value: "eventNo" },
        { text: "Event", value: "eventDescription" },
        { text: "Address", value: "address" },
        { text: "Paid", value: "paid" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions" },
      ];
    },
  },
  methods: {
    viewBooking(item) {
      this.$root.routeTo({
        name: "BookingView",
        params: { bookingNo: item.bookingNo },
      });
    },
    viewEvents() {
      this.$router.push({ name: "EventList" });
    },
    bookingStatusColor(status) {
      if (status) {
        return helper.status()[status.toLowerCase()];
      }
    },
  },
};
</script>
