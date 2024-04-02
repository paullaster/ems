<template>
  <v-expansion-panels dense light flat v-model="expanded">
    <v-expansion-panel @click.prevent="onClick()">
      <v-expansion-panel-header>
        <div class="text-lg-h6 primary--text">
          Booking: {{ booking ? booking.bookingNo : "" }} &nbsp;
          <v-chip
            dark
            small
            :color="
              booking.status === 'Cancelled'
                ? 'grey darken-1'
                : 'green darken-1'
            "
          >
            {{ booking.status }}</v-chip
          >
        </div>
        <v-spacer />
        <v-btn
          v-if="booking.status === 'Open'"
          @click="cancelBooking()"
          dark
          small
          color="red"
          class="mr-2"
        >
          <v-icon small left>mdi-cancel</v-icon>
          Cancel booking
        </v-btn>
        <v-btn
          :disabled="booking.status === 'Cancelled'"
          @click="
            $root.routeTo({
              name: 'invoice',
              params: { bookingNo: booking.bookingNo },
            })
          "
          dark
          small
          color="orange darken-3"
          class="mr-2"
          v-if="
            booking.proformaInvoiceNo.length !== 0 &&
            booking.postedInvoiceNo.length === 0
          "
        >
          View Proforma Invoice
          <v-icon size="25" left class="mx-1">arrow_forward</v-icon>
        </v-btn>

        <v-btn
          :disabled="booking.status === 'Cancelled'"
          @click="viewInvoice(booking.postedInvoiceNo, booking.bookingNo)"
          dark
          small
          color="orange darken-3"
          class="mr-2"
          v-if="booking.postedInvoiceNo.length !== 0"
        >
          Print Invoice
          <v-icon size="25" left class="mx-1">arrow_forward</v-icon>
        </v-btn>

        <v-btn
          v-if="booking.paid"
          @click="
            $root.routeTo({
              name: 'receipt',
              params: { receiptNo: booking.receiptNo },
            })
          "
          dark
          small
          color="blue darken-3"
          class="mx-2"
          width="10%"
        >
          Print Receipt
          <v-icon size="25" left class="mx-4"> arrow_forward </v-icon>
        </v-btn>
        <template v-slot:actions>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                icon
                outlined
                color="primary"
                @click.stop="onClick()"
              >
                <v-icon color="primary"> $expand </v-icon>
              </v-btn>
            </template>
            <span>{{ expanded === 0 ? "Hide" : "Show" }} Event Details</span>
          </v-tooltip>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list dense>
          <v-list-item>
            <v-row>
              <v-col cols="12" md="4" sm="12" lg="4">
                <v-list-item-content>
                  <v-list-item-title>Event</v-list-item-title>
                  <v-list-item-subtitle class="text-wrap">
                    {{ cpdEvent.description }} on {{ cpdEvent.startDate }} at
                    {{ cpdEvent.location }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col cols="12" md="4" sm="12" lg="4">
                <v-list-item two-line-line>
                  <v-list-item-content>
                    <v-list-item-title>Billed To</v-list-item-title>
                    <v-list-item-subtitle class="text-wrap">{{
                      booking.names
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="4" sm="12" lg="4">
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title>Contact</v-list-item-title>
                    <v-list-item-subtitle class="text-wrap">{{
                      booking.address
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle
                      >{{ maskString(booking.email) }},
                      {{ maskString(booking.phoneNo) }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import bookingMixin from "./bookingMixin";
export default {
  name: "BookingViewTop",
  props: {
    booking: {
      type: Object,
      required: true,
    },
    cpdEvent: {
      type: Object,
      required: true,
    },
  },
  mixins: [bookingMixin],
  data: function () {
    return {
      expanded: 0,
    };
  },
  methods: {
    cancelBooking: function () {
      this.$confirm.show({
        title: "Cancel Booking",
        text: `Are you sure you want to cancel this booking ?`,
        onConfirm: () => {
          this.$store.dispatch("Events/cancelBooking", {
            bookingNo: this.booking.bookingNo,
            eventNo: this.cpdEvent.no,
            email: this.booking.email,
            cpdEvent: this.eventBAsicInfo(),
          });
        },
      });
    },
    eventBAsicInfo: function () {
      let basic = { ...this.cpdEvent };
      delete basic.eventPackageCost;
      delete basic.eventProviders;
      delete basic.eventsDocuments;

      return basic;
    },
    viewInvoice: function (invoiceNo, bookingNo) {
      const routeData = this.$router.resolve({
        name: "invoice",
        params: {
          bookingNo: btoa(bookingNo),
          posted: btoa(invoiceNo),
        },
      });
      window.open(routeData.href, "_blank");
    },
    onClick() {
      const curr = this.expanded;
      this.expanded = curr === undefined ? 0 : undefined;
    },
  },
};
</script>
