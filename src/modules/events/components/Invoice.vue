<template>
  <div class="my-5">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card rounded>
            <v-card-title>
              {{ posted ? "" : "Proforma" }} Invoice
              <v-spacer />
              <v-btn @click="download" outlined dark color="orange darken-3">
                <v-icon left>mdi-cloud-download</v-icon>
                Download
              </v-btn>

              <v-dialog persistent v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-on="on"
                    v-bind="attrs"
                    dark
                    color="green darken-3"
                    class="ml-2"
                  >
                    <v-icon left>mdi-cash-multiple</v-icon>
                    Pay Now
                  </v-btn>
                </template>
                <v-card class="mx-auto">
                  <v-card-title>
                    Already Paid for this Event?
                    <v-spacer />
                    <v-btn icon @click="dialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="paymentForm" v-model="isValid">
                      <v-text-field
                        dense
                        outlined
                        v-model="transactionCode"
                        placeholder="Enter Mpesa Transaction Number"
                        label="Enter Mpesa Transaction Number"
                        :rules="paymentRules"
                      >
                        <template v-slot:append>
                          <v-icon>mdi-credit-card</v-icon>
                        </template>
                      </v-text-field>
                    </v-form>
                  </v-card-text>
                  <div
                    v-if="$vuetify.breakpoint.mobile"
                    class="d-flex flex-column"
                  >
                    <v-btn
                      color="green darken-3"
                      class="align-self-center white--text mb-3"
                      min-width="90%"
                      @click="confirmPayment"
                      :disabled="transactionCode.length < 1"
                    >
                      Confirm Payment
                    </v-btn>
                    <div class="align-self-center mb-3">or</div>
                    <v-btn
                      color="primary"
                      @click="pay"
                      min-width="90%"
                      class="mb-3 align-self-center white--text"
                    >
                      Proceed To Payment
                    </v-btn>
                  </div>
                  <v-card-actions v-if="!$vuetify.breakpoint.mobile">
                    <v-btn
                      color="green darken-3"
                      @click="pay"
                      class="white--text"
                    >
                      Proceed To Payment
                    </v-btn>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      @click="confirmPayment"
                      :disabled="transactionCode.length < 1"
                    >
                      Confirm Payment
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-divider />
            <pdf
              style="width: 100%"
              :src="`data:application/pdf;base64,${proforma}`"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Checkout />
  </div>
</template>

<script>
import fileType from "file-type";
import { appUrl } from "../../../environment/environment";
import Checkout from "@kinetics254/paygate/src/views/Checkout.vue";

import pdf from "vue-pdf";
export default {
  name: "Invoice",
  components: { pdf, Checkout },
  data() {
    return {
      posted: undefined,
      transactionCode: "",
      dialog: false,
      isValid: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((v) => {
      v.posted = v.$route.params.posted;
      v.$store.dispatch("Events/getProforma", v.$route.params.bookingNo);
      v.$store.dispatch(
        "Events/getBooking",
        v.$root.decryptRoute(v.$route).params.bookingNo
      );
    });
  },
  computed: {
    proforma() {
      return this.$store.getters["Events/proforma"];
    },

    booking() {
      return this.$store.getters["Events/booking"];
    },

    paymentRules() {
      return [(v) => !!v || "Transaction is required"];
    },
  },
  methods: {
    download: async function () {
      const myBuffer = Buffer.from(this.proforma, "base64");
      await fileType.fromBuffer(myBuffer).then((res) => {
        const path = `data:${res.mime})};base64,${this.proforma}`;
        const element = document.createElement("a");
        element.setAttribute("href", path);
        element.setAttribute(
          "download",
          `${this.$root.decryptRoute(this.$route).params.bookingNo}.pdf`
        );
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
    },

    pay: function () {
      let payload = {
        payerID: this.booking.referenceNo,
        sourceDocumentNo: this.booking.bookingNo,
        description: "Booking Fees",
        amount: this.booking.amountInclVAT,
        accountNo: this.booking.phoneNo || "",
        success_url: `${appUrl}${
          this.$router.resolve({
            name: "BookingView",
            ...this.$root.encryptRoute({
              params: { bookingNo: this.booking.bookingNo },
            }),
          }).href
        }`,
        fail_url: window.location.href,
      };

      payload = btoa(JSON.stringify(payload));
      // window.location.href = `${payGateUrl}?payload=${payload}`;
      this.$checkout.pay(payload);
    },
    confirmPayment: function () {
      if (!this.isValid) {
        this.$refs.paymentForm.validate();
      } else {
        this.dialog = false;
        this.$store.dispatch("Events/confirmPayment", {
          bookingNo: this.booking.bookingNo,
          transactionCode: this.transactionCode,
        });
      }
    },
  },
};
</script>

<style scoped></style>
