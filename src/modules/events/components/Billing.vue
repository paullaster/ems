<template>
  <div class="my-5">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card
            outlined
            :class="`mb-10 ${$vuetify.breakpoint.mobile ? '' : 'mx-10'}`"
          >
            <v-card-title>
              <v-btn
                text
                @click="
                  $router.push({
                    name: 'BookingView',
                    params: { bookingNo: $route.params.bookingNo },
                  })
                "
              >
                <v-icon left>mdi-arrow-left</v-icon>
                Back
              </v-btn>

              <v-spacer />

              Billing Information

              <v-spacer />

              <span class="overline">
                Booking No. : {{ decryptedRoute.params.bookingNo }}
              </span>
            </v-card-title>

            <v-divider />

            <v-alert type="info" dense text>
              <ul>
                <li v-for="(item, i) in setupDisclaimer" :key="i">
                  {{ item.description }}
                </li>
              </ul>
            </v-alert>

            <v-row class="mt-n4 px-5">
              <v-col cols="12" md="8">
                <v-chip-group
                  active-class="green lighten-1"
                  mandatory
                  v-model="activeChip"
                >
                  <v-chip
                    v-for="(item, i) in billingTypes"
                    :key="i"
                    :value="item.value"
                    filter
                    color="primary"
                    :outlined="item.value !== activeChip"
                  >
                    {{ item.label }}
                  </v-chip>
                </v-chip-group>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  label=""
                  v-if="billing === 'Member'"
                  color="primary"
                  v-model="search"
                  hint="Search by Member No / ID or Passport"
                  persistent-hint
                  placeholder="Member No"
                  filled
                  dense
                  @keyup.enter="searchProfile"
                  class="search"
                  elevation-12
                >
                  <template v-slot:append-outer>
                    <v-btn
                      depressed
                      @click="searchProfile"
                      color="primary"
                      class="ma-0 search-btn text-capitalize"
                      :loading="loadingSearch"
                    >
                      <v-icon class="mx-2">mdi-account-search</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-divider />

            <v-card-text class="pa-5">
              <v-form class="mt-5">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-form
                      style="width: 100%"
                      class="d-flex flex-column justify-start"
                    >
                      <v-checkbox
                        class="mt-0"
                        v-if="billing === 'Company'"
                        v-model="hasCreditReference"
                        label="I have a credit reference no."
                      />

                      <v-checkbox
                        class="mt-0"
                        v-if="billing !== 'Company'"
                        v-model="isMember"
                        label="Is a Member"
                      />

                      <!--Reference No/ Member No. Credit Reference-->
                      <v-text-field
                        v-show="billing !== 'Non-Member'"
                        ref="referenceNo"
                        :rules="
                          billing === 'Company' ? [] : billingRules.referenceNo
                        "
                        v-model="formData.referenceNo"
                        v-if="
                          (billing === 'Company' && hasCreditReference) ||
                          billing === 'Member'
                        "
                        :disabled="billing !== 'Company'"
                        :placeholder="
                          billing === 'Company'
                            ? 'Credit Reference No.'
                            : 'Member No'
                        "
                        outlined
                        clearable
                        dense
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary" class="mt-1" size="30"
                            >mdi-account-box</v-icon
                          >
                        </template>
                        <template v-slot:label>
                          {{
                            billing === "Member"
                              ? "Member No"
                              : "Credit Reference No."
                          }}<span
                            v-if="billing === 'Company'"
                            class="mx-2"
                            style="color: red"
                            >*</span
                          >
                        </template>
                        <template v-slot:append-outer>
                          <div>
                            <v-btn
                              v-if="
                                formData.referenceNo && billing === 'Company'
                              "
                              color="primary"
                              small
                              depressed
                              @click="searchCreditRef()"
                            >
                              search
                            </v-btn>
                          </div>
                        </template>
                      </v-text-field>

                      <!--Name-->
                      <v-text-field
                        ref="names"
                        v-model="formData.names"
                        :rules="billingRules.names"
                        placeholder="Name"
                        outlined
                        clearable
                        dense
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary" class="mt-1" size="30"
                            >mdi-account</v-icon
                          >
                        </template>
                        <template v-slot:label>
                          {{ billing === "Company" ? "Company Name" : "Name" }}
                          <span
                            class="mx-2"
                            style="color: red"
                            v-if="billing === 'Company'"
                            >*</span
                          >
                        </template>
                      </v-text-field>

                      <!--KRA-->
                      <v-text-field
                        v-if="billing === 'Company'"
                        ref="kraPin"
                        v-model="formData.IdentificationDocumentNo"
                        :rules="billingRules.kraPin"
                        placeholder="KRA Pin"
                        outlined
                        clearable
                        dense
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary" class="mt-1" size="30"
                            >person</v-icon
                          >
                        </template>
                        <template v-slot:label>
                          KRA Pin
                          <span class="mx-2" style="color: red">*</span>
                        </template>
                      </v-text-field>

                      <!--ID-->
                      <v-text-field
                        v-if="billing === 'Member' || billing === 'Non-Member'"
                        ref="idNo"
                        v-model="formData.idNo"
                        placeholder="ID/Passport"
                        outlined
                        clearable
                        dense
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary" class="mt-1" size="30"
                            >person</v-icon
                          >
                        </template>
                        <template v-slot:label>
                          ID/Passport
                          <span class="mx-2" style="color: red">*</span>
                        </template>
                      </v-text-field>

                      <!--Email-->
                      <v-text-field
                        ref="email"
                        v-model="formData.email"
                        :rules="billingRules.email"
                        placeholder="Email"
                        outlined
                        dense
                        clearable
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary" class="mt-1" size="30"
                            >email</v-icon
                          >
                        </template>
                        <template v-slot:label>
                          Enter Your Email<span class="mx-2" style="color: red"
                            >*</span
                          >
                        </template>
                      </v-text-field>

                      <!--Phone-->
                      <v-text-field
                        type="tel"
                        ref="phoneNo"
                        v-model="formData.phoneNo"
                        placeholder="Phone Number"
                        outlined
                        clearable
                        dense
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary" class="mt-1" size="30"
                            >phone</v-icon
                          >
                        </template>
                        <template v-slot:label>
                          Enter Phone Number<span
                            class="mx-2"
                            style="color: red"
                          ></span>
                        </template>
                      </v-text-field>

                      <!--Address-->
                      <v-text-field
                        ref="address"
                        v-model="formData.address"
                        :rules="billingRules.address"
                        placeholder="Address"
                        outlined
                        clearable
                        dense
                        prepend-inner-icon="email"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon color="primary" class="mt-1" size="30"
                            >email</v-icon
                          >
                        </template>
                        <template v-slot:label>
                          Address<span class="mx-2" style="color: red">*</span>
                        </template>
                      </v-text-field>
                    </v-form>
                  </v-col>

                  <v-col
                    cols="12"
                    md="4"
                    offset-md="2"
                    :class="$vuetify.breakpoint.mobile ? 'mb-10' : ''"
                  >
                    <v-card outlined>
                      <v-list two-line class="text-right" v-if="booking">
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-subtitle class="caption"
                              >Total Excl. VAT</v-list-item-subtitle
                            >
                            <v-list-item-title class="text-h6 overline">
                              {{
                                booking.currencyCode === "KES" ||
                                booking.currencyCode === ""
                                  ? booking.amountExclLCY
                                  : booking.amountExclVAT
                              }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-subtitle class="caption"
                              >Total Incl. VAT</v-list-item-subtitle
                            >
                            <v-list-item-title class="text-h6 overline">
                              {{
                                booking.currencyCode === "KES" ||
                                booking.currencyCode === ""
                                  ? booking.amountInclLCY
                                  : booking.amountInclVAT
                              }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>

                      <v-row>
                        <v-col cols="12" md="6">
                          <v-btn
                            text
                            small
                            :block="$vuetify.breakpoint.mobile"
                            @click="save"
                          >
                            {{ settings.SaveAndPrint }}
                            <v-icon size="25" class="mx-2" left
                              >mdi-printer</v-icon
                            >
                          </v-btn>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-btn
                            v-if="!hasCreditReference"
                            small
                            :block="$vuetify.breakpoint.mobile"
                            :class="
                              $vuetify.breakpoint.mobile ? 'mt-n3' : 'mb-2'
                            "
                            @click="payment"
                            color="primary"
                          >
                            {{ settings.Checkout }}
                            <v-icon size="25" left class="mx-2"
                              >arrow_forward</v-icon
                            >
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Checkout />
  </div>
</template>

<script>
import { appUrl } from "../../../environment/environment";
import Checkout from "@kinetics254/paygate/src/views/Checkout.vue";
import eventMixin from "../eventMixin";

export default {
  name: "Billing",
  components: {
    Checkout,
  },
  mixins: [eventMixin],
  data: function () {
    return {
      hasCreditReference: false,
      search: "",
      billing: "",
      onlyCountries: ["KE", "UG", "TZ"],
      formData: {
        address: "",
        bookingNo: "",
        // city: "",
        // county: "",
        email: "",
        eventNo: "",
        idNo: "",
        names: "",
        phoneNo: "",
        referenceNo: "",
        billToName: "",
        billToAddress: "",
        billToEmail: "",
        billToPhoneNo: "",
        billToPINNo: "",
      },
      billingTypes: [
        {
          value: "Individual",
          label: "Individual",
        },
        {
          value: "Company",
          label: "Corporate",
        },
      ],
      rules: {
        common: {
          required: (v) => !!v || "Field is required.",
        },
      },
      isMember: false,
      activeChip: "",
    };
  },

  beforeRouteEnter(to, from, next) {
    next((v) => {
      v.$store.dispatch("Events/getBooking", v.decryptedRoute.params.bookingNo);
      v.$store.dispatch("Events/getCities");
      v.$store.dispatch("Events/getCounties");
      v.$store.dispatch("Events/getDisclaimers");
      v.$store.dispatch("Events/getCreditReferenceData");
    });
  },

  mounted() {
    Event.$on("billing-saved", (checkout) => {
      if (checkout) {
        this.pay();
      } else {
        if (parseInt(this.booking.amountInclVAT) === 0) {
          this.$router.push({
            name: "EventList",
          });
        } else {
          this.$router.push({
            name: "invoice",
            params: {
              bookingNo: this.$route.params.bookingNo,
            },
          });
        }
      }
    });
  },

  computed: {
    booking() {
      return this.$store.getters["Events/booking"];
    },

    decryptedRoute() {
      return this.$root.decryptRoute(this.$route);
    },

    billingCompany() {
      return process.env.VUE_APP_COMPANY_NAME;
    },

    counties() {
      return this.$store.getters["Events/counties"];
    },

    cities() {
      return this.$store.getters["Events/cities"];
    },

    profile() {
      return this.$store.getters["Events/profile"];
    },

    company() {
      return this.$store.getters["Events/profile"];
    },

    billingRules() {
      return {
        referenceNo: [
          (v) => {
            return this.billing === "Company"
              ? !!v || "Member number is required"
              : true;
          },
        ],
        names: [(v) => !!v || "Name is required."],
        // idNo: [(v) => !!v || "ID/Passport is required."],
        kraPin: [
          (v) => !!v || "Company Kra Pin is required.",
          (v) => {
            const kraPinRegex = /^([A-Z])\d[0-9]{8}[A-Z]$/i;
            return kraPinRegex.test(v) || "Invalid KRA Pin format";
          },
        ],
        email: [
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid e-mail.";
          },
        ],
        address: [(v) => !!v || "Address is required."],
      };
    },

    cpdEvent() {
      let currEvent = this.$store.getters["Events/events"].filter(
        (a) => a.no === this.booking.eventNo
      );
      currEvent = currEvent.length > 0 ? currEvent.shift() : null;
      return currEvent;
    },

    setupDisclaimer() {
      return this.$store.getters["Events/disclaimers"].filter(
        (item) =>
          (item.documentNo === "" && item.disclaimerType === "Billing") ||
          (item.documentNo === this.booking.bookingNo &&
            item.disclaimerType === "Billing")
      );
    },

    loadingSearch() {
      return this.$store.getters["Events/loadingSearch"];
    },

    creditReferenceData() {
      return this.$store.getters["Events/creditReferenceData"];
    },

    creditReference() {
      return this.$store.getters["Events/creditReference"];
    },

    settings() {
      return JSON.parse(window.localStorage.getItem("aquila_captions"));
    },
  },

  methods: {
    payment: function () {
      if (this.validateBilling()) {
        const data = this.unmaskValues({ ...this.formData });
        this.$store.dispatch("Events/saveBilling", {
          ...data,
          checkout: true,
        });
      }
    },

    searchCreditRef() {
      const data = this.creditReference.filter(
        (item) => item.creditAuthorizationNo === this.formData.referenceNo
      )[0];
      console.log(data);
      if (data) {
        this.formData.billToAddress = data.address;
        this.formData.billToPINNo = data.customerPINNo;
        this.formData.billToEmail = data.email;
        this.formData.billToPhoneNo = data.phoneNo;
        this.formData.billToName = data.name;
        this.formData.address = data.address;
        this.formData.idNo = data.customerPINNo;
        this.formData.email = data.email;
        this.formData.phoneNo = data.phoneNo;
        this.formData.names = data.description;
      } else {
        Event.$emit("ApiWarning", "Invalid Credit Reference Number");
      }
    },

    save: function () {
      if (this.validateBilling());
      const data = this.unmaskValues({ ...this.formData });
      this.$store.dispatch("Events/saveBilling", {
        ...data,
        checkout: false,
      });
    },

    validateBilling: function () {
      let invalidKey = "";
      this.formData.bookingNo = this.decryptedRoute.params.bookingNo;
      this.formData.eventNo = this.booking.eventNo;
      this.formData.bookingType = this.billing;
      this.formData.cpdEvent = this.eventBAsicInfo();
      // this.formData.billToAddress = this.formData.address;
      // this.formData.billToName = this.formData.names;
      // this.formData.billToEmail = this.formData.email;
      // this.formData.billToPhoneNo = this.formData.phoneNo;
      let isValid = true;
      for (const key in this.billingRules) {
        if (this.$refs[key])
          isValid = isValid ? this.$refs[key].validate(true) : false;
        if (!isValid) {
          invalidKey = key.toUpperCase();

          Event.$emit(
            "ApiError",
            `We couldn't generate your proforma, kindly enter your ${invalidKey} to proceed`
          );

          break;
        }
      }

      return isValid;
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
              query: {},
            }),
          }).href
        }`,
        fail_url: window.location.href,
      };

      payload = btoa(JSON.stringify(payload));
      // window.location.href = `${payGateUrl}?payload=${payload}`;
      this.$checkout.pay(payload);
    },

    eventBAsicInfo: function () {
      let basic = { ...this.cpdEvent };
      delete basic.eventPackageCost;
      delete basic.eventProviders;
      delete basic.eventsDocuments;

      return basic;
    },

    searchProfile: function () {
      if (this.search === "") return;
      this.$store.dispatch("Events/searchProfile", this.search.trim());
    },

    reset: function () {
      this.formData = {
        address: "",
        bookingNo: "",
        email: "",
        eventNo: "",
        idNo: "",
        names: "",
        phoneNo: "",
        referenceNo: "",
        billToName: "",
        billToAddress: "",
        billToEmail: "",
        billToPhoneNo: "",
        billToPINNo: "",
      };
    },

    init: function (data) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        const maskedValue =
          typeof value === "string" &&
          (key === "idNo" || key === "phoneNo" || key === "address")
            ? value.substr(0, 3) + "******&" + value.substr(-3)
            : value;
        this.formData[key] = maskedValue;
      }
      return formData;
    },

    unmaskValues(data) {
      for (const [key, value] of Object.entries(data)) {
        // check if value is masked
        if (typeof value === "string" && value.includes("******&")) {
          data[key] = this.booking[key];
        }
      }
      return data;
    },
  },

  watch: {
    profile: {
      handler: function (profile) {
        const contacts = profile ? profile.contacts[0] : null;
        this.formData.eventNo = this.booking.eventNo;
        this.formData.city = contacts ? contacts.City : "";
        this.formData.county = contacts ? contacts.County : "";
        this.formData.email = profile.Email ? profile.Email : contacts.Email;
        this.formData.idNo = profile.IdentificationDocumentNo || "";
        this.formData.referenceNo = profile.MemberNo || "";
        this.formData.names = `${profile.FirstName} ${profile.SecondName} ${profile.LastName}`;
        this.formData.phoneNo = contacts ? contacts.PhoneNo : "";
        this.formData.address = contacts ? contacts.Address : "";
      },
    },

    company: {
      handler: function () {
        // TODO Fill Company Information
      },
    },

    booking: {
      handler: function (booking) {
        this.init({ ...booking });

        if (booking.paid) {
          this.$root.routeTo({
            name: "invoice",
            params: { bookingNo: booking.bookingNo },
          });
        }

        if (parseInt(booking.amountInclVAT) === 0) {
          this.$confirm.show({
            title: "Confirm Booking",
            text: "Successfull booking, kindly click confirm to confirm booking",
            onConfirm: () => {
              const data = this.unmaskValues({ ...this.formData });
              data.billToEmail = data.email;
              this.$store.dispatch("Events/saveBilling", {
                ...data,
                checkout: false,
              });
            },
            onCancel: () => {
              this.$router.back();
            },
          });
        }

        this.billing = booking.referenceNo ? "Member" : "Non-Member";
      },
      deep: true,
    },

    activeChip: {
      handler: function (n) {
        if (n)
          switch (n) {
            case "Company":
              this.reset();
              this.billing = n;
              this.hasCreditReference = false;
              break;
            case "Individual":
              if (this.booking.bookingType === "Non-Member") {
                this.reset();
                this.billing = this.booking.bookingType;
                this.hasCreditReference = false;
              } else {
                this.init({ ...this.booking });
                this.isMember = true;
                this.billing = this.booking.bookingType;
              }
              break;
          }
      },
    },

    isMember: {
      handler: function (n) {
        if (n === true) {
          this.billing = "Member";
        } else {
          this.billing = "Non-Member";
          this.reset();
        }
      },
    },

    hasCreditReference() {
      if (this.hasCreditReference === false) this.formData.referenceNo = "";
    },
  },
};
</script>

<style>
@import url("../styles.css");
</style>
