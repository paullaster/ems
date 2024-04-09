<template>
  <v-container fluid>
    <v-dialog v-model="paymentDialog" persistent width="500px">
      <v-card>
        <v-card-title>
          <span>Pay for {{ event.title }} event</span>
        </v-card-title>
        <v-card-text>
          <v-row flex>
            <v-col cols="12" class="my-3 mx-3">
              <v-text-field
                label="Amount to Pay"
                required
                readonly
                v-model="FormData.amount"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="my-3 mx-3">
              <v-text-field
                label="Mpesa phone number"
                required
                v-model="FormData.phoneNumber"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="paymentDialog = false"
            >Close</v-btn
          >
          <v-btn color="primary" @click="pay"
            >Pay KES. {{ FormData.amount }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "PaymentDialog",
  data() {
    return {
      FormData: {
        amount: 0,
        phoneNumber: "",
        bookingNo: "",
        TransactionDesc: "",
      },
    };
  },
  computed: {
    booking: {
      get() {
        return this.$store.getters["Events/booking"];
      },
    },
    eventDelegates: {
      get() {
        return this.$store.getters["Events/eventDelegate"];
      },
    },
    event: {
      get() {
        return this.$store.getters["Events/event"];
      },
    },
    paymentDialog: {
      get() {
        return this.$store.getters["Events/paymentDialog"];
      },
      set(value) {
        this.$store.commit("Events/SET_PAYMENT_DIALOG", value);
      },
    },
  },
  watch: {
    eventDelegates(val) {
      if (val) {
        this.FormData.amount = this.booking.amount * val.length;
      }
    },
  },
  methods: {
    pay() {
      this.FormData.bookingNo = this.booking.id;
      this.FormData.TransactionDesc = `Payment for ${this.event.title} event booking`;
      this.$store.dispatch("Events/pay", this.FormData);
      this.FormData = {};
      this.paymentDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
