<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    width="70%"
    :fullscreen="$vuetify.breakpoint.mobile"
    :content-class="`${
      $vuetify.breakpoint.mobile ? 'mobile' : ''
    } delegate--dialog`"
  >
    <v-card class="mx-auto" rounded>
      <div
        :class="`d-flex ${
          $vuetify.breakpoint.mobile ? 'flex-column' : ''
        } top-bar`"
      >
        <div class="headline pa-2">
          {{ decryptedRoute.params.id !== undefined ? "Edit" : "Add" }}
          Delegate:
        </div>
        <div
          class="headline pa-2 text-truncate"
          :style="`width: ${$vuetify.breakpoint.mobile ? '85%' : '60%'}`"
        >
          {{ event.description }} on {{ event.startDate }} at
          {{ event.location }}
        </div>
        <div :class="`pa-2 ${$vuetify.breakpoint.mobile ? '' : 'ml-auto'}`">
          <v-chip
            color="primary"
            class="font-weight-bold"
            label
            style="width: 100%"
          >
            <v-icon left class="mr-2">mdi-cash</v-icon>
            Total:
            {{ displaySelectedAmount | currencyFormat }}
          </v-chip>
        </div>
        <v-btn
          elevation="0"
          color="deep-orange darken-4"
          class="mt-n3 mr-n3"
          icon
          absolute
          top
          right
          @click="closeDialog"
          v-if="$vuetify.breakpoint.mobile"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider />
      <div>
        <delegate-details />
      </div>
      <div>
        <!-- <SelectBilling v-if="displaySelectBilling" /> -->
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import bookingMixin from "./bookingMixin";
import DelegateDetails from "./DelegateDetails.vue";
// import SelectBilling from "./SelectBilling.vue";
export default {
  name: "DelegateCard",
  mixins: [bookingMixin],
  components: {
    DelegateDetails,
    // SelectBilling,
  },
  data() {
    return {
      dialog: true,
      tabs: null,
      displaySelectBilling: false,
    };
  },
  computed: {
    isBookingView() {
      return this.decryptedRoute.query.bookingNo !== undefined;
    },
    event() {
      return this.$store.getters["Events/event"];
    },
  },
  mounted() {
    //dispatch to refetch event based on route params
    if (this.decryptedRoute.params.no !== undefined) {
      //console.log("no", this.decryptedRoute.params.no);
      this.$store.dispatch("Events/getEvent", this.decryptedRoute.params.no);
    }
    if (this.$route.query.member) {
      this.$store.dispatch(
        "Events/searchProfile",
        this.decryptedRoute.query.member.trim()
      );
    }
    Event.$on("saveBooking", (data) => {
      if (this.$route.query.bookingNo || this.$route.params.bookingNo) {
        this.$store.dispatch(
          "Events/getBooking",
          this.$route.query.bookingNo
            ? this.decryptedRoute.query.bookingNo
            : this.decryptedRoute.params.bookingNo
        );
      } else {
        this.$root.routeTo({
          name: "BookingView",
          params: { bookingNo: data.bookingNo },
        });
      }
    });
    Event.$on("saveBookingClear", (data) => {
      this.$root.routeTo({
        name: "DelegateCard",
        params: {
          no: data.eventNo,
        },
        query: {
          bookingNo: data.bookingNo,
        },
      });
    });
  },
  watch: {
    event: {
      handler() {
        if (this.event) {
          this.displaySelectBilling = !this.isBookingView;
        }
      },
      deep: true,
    },
  },
};
</script>
<style>
@import url("../../styles.css");
</style>
