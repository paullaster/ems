/* eslint-disable */
<template>
  <div>
    <v-card flat class="mx-auto">
      <v-card-text
        :class="`${$vuetify.breakpoint.mobile ? 'mb-10 pb-10' : ''}`"
      >
        <v-alert
          v-show="errorAlert.show"
          type="error"
          :ref="errorAlert"
          dismissible
          text
          @input="closeAlert"
        >
          {{ errorAlert.message }}
        </v-alert>
        <div class="mt-2">
          <v-form ref="delegateForm" id="delegateForm" v-model="isValid">
            <v-row dense>
              <!--Full Names-->
              <v-col
                cols="12"
                md="3"
                :class="$vuetify.breakpoint.mobile ? 'mt-n4' : ''"
              >
                <div>
                  Enter Your Full Name<span class="mx-2" style="color: red"
                    >*</span
                  >
                </div>
                <v-text-field
                  ref="name"
                  :rules="delegateRules.name"
                  v-model="delegateForm.name"
                  placeholder="Full Name"
                  validate-on-blur
                  outlined
                  dense
                  clearable
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >person</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>

              <!--Gender-->
              <v-col
                cols="12"
                md="3"
                :class="$vuetify.breakpoint.mobile ? 'mt-n4' : ''"
              >
                <div>Gender<span class="mx-2" style="color: red">*</span></div>
                <v-select
                  placeholder="Enter Gender"
                  v-model="delegateForm.gender"
                  :items="['Male', 'Female', 'Other']"
                  ref="gender"
                  :rules="delegateRules.gender"
                  validate-on-blur
                  dense
                  outlined
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >mdi-account</v-icon
                    >
                  </template>
                </v-select>
              </v-col>

              <!--Email-->
              <v-col
                cols="12"
                md="3"
                :class="delegateForm.delegateType === 'Member' ? 'mt-n4' : ''"
              >
                <div>
                  Enter Your Email<span class="mx-2" style="color: red">*</span>
                </div>
                <v-text-field
                  ref="email"
                  :rules="delegateRules.email"
                  v-model="delegateForm.email"
                  placeholder="Email"
                  validate-on-blur
                  outlined
                  dense
                  clearable
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >email</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>

              <!--Phone-->
              <v-col cols="12" md="3" class="mt-n4">
                <div>
                  Enter Phone Number<span class="mx-2" style="color: red"
                    >*</span
                  >
                </div>
                <vue-tel-input
                  ref="phoneNo"
                  v-model="delegateForm.phone"
                  mode="international"
                  required="true"
                  :valid-characters-only="true"
                  :input-options="inputOptions"
                ></vue-tel-input>
              </v-col>
              <!-- address -->
              <v-col cols="12" md="3" class="mt-n4">
                <div>
                  Enter Address<span class="mx-2" style="color: red">*</span>
                </div>
                <v-text-field
                  ref="address"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateForm.address"
                  placeholder="Address"
                  outlined
                  dense
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="mt-n4"
                v-show="isEbkNumberRequired"
              >
                <v-text-field
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateForm.referenceNo"
                  ref="referenceNo"
                  placeholder="EBK Number"
                  :rules="delegateRules.referenceNo"
                  outlined
                  dense
                  clearable
                />
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div :class="`d-flex ${$vuetify.breakpoint.mobile ? 'py-3' : 'mt-5'}`">
          <v-btn
            elevation="0"
            class="pa-2 mr-auto"
            color="text-capitalize deep-orange lighten-4 deep-orange--text text--darken-4"
            @click="closeDialog"
            v-if="!$vuetify.breakpoint.mobile"
          >
            <v-icon class="mx-2">mdi-close</v-icon>
            Close</v-btn
          >
          <v-btn
            color="primary"
            outlined
            class="white--text pa-2"
            @click="verify('clear')"
            >Save Delegate & Clear</v-btn
          >
          <v-btn
            color="primary"
            class="white--text pa-2 ml-2"
            @click="verify('close')"
            >Save Delegate & Close</v-btn
          >
        </div>
      </v-card-text>
    </v-card>
    <v-overlay color="#EBF5FB" v-if="$store.getters['Events/validating']">
      <div clas="d-flex flex-column">
        <v-progress-circular
          indeterminate
          size="64"
          width="3"
          color="primary"
        ></v-progress-circular>
        <div class="mt-2 primary--text">saving ....</div>
      </div>
    </v-overlay>
    <DelegateArrivalVue
      :dialog="delegateArrivaldialog"
      @settingArrivalDialog="dialogSetting"
      @setArrivalDetails="settingArrivalDetails"
    />
  </div>
</template>
<script>
import bookingMixin from "./bookingMixin";
import { AuthService } from "@/modules/auth";
import { VueTelInput } from "vue-tel-input";

export default {
  name: "DelegateForm",
  mixins: [bookingMixin],
  components: {
    VueTelInput,
  },
  data() {
    return {
      inputOptions: {
        showDialCode: true,
      },
      isValid: false,
      alert: {
        show: false,
        message: "",
      },
      currency: "Local",
      delegateForm: {
        booking: "",
        email: "",
        gender: "",
        name: "",
        phone: "",
        bookingDate: "",
      },
    };
  },
  mounted() {
    console.log(this.$route.params);
    this.$refs.phoneNo.validate = (bool) => {
      console.log(bool);
      return bool;
    };

    if (this.$route.params.id !== undefined && this.eventDelegate.length > 0) {
      this.delegateForm = {
        ...this.eventDelegate[parseInt(this.$route.params.id)],
      };
    } else {
      this.resetDelegateForm();
      if (this.eventDelegate.length === 0) {
        if (AuthService.check()) {
          const user = AuthService.user;
          user.Email = user.email;
          const userDetails = user.profile ? user.profile : user;
          userDetails.contacts = [
            {
              Email: userDetails.Email,
              PhoneNo: userDetails.PhoneNo ?? "",
              Address: userDetails.Address ?? "",
            },
          ];
          this.initBookingProfile(userDetails);
        }
      }
    }
  },
  computed: {
    currentEvent() {
      return this.event.constructor === Array ? {} : this.event;
    },
    delegateRules() {
      return {
        memberNo: [
          (v) => {
            return this.delegateForm.delegateType === "Member"
              ? !!v || "Member number is required."
              : true;
          },
        ],
        name: [(v) => !!v || "Name is required."],
        gender: [(v) => !!v || "Gender is required."],
        email: [
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid e-mail.";
          },
        ],
        phoneNo: [(v) => !!v || "Phone Number is required."],
        county: [(v) => !!v || "County is required."],
      };
    },
    loadingSearch() {
      return this.$store.getters["Events/loadingSearch"];
    },
    event() {
      return this.$store.getters["Events/event"];
    },
    booking() {
      return this.$store.getters["Events/booking"];
    },
    isBookingView() {
      return this.decryptedRoute.query.bookingNo !== undefined;
    },
    errorAlert: {
      get() {
        return this.alert;
      },
      set(val) {
        this.alert = val;
      },
    },
    billingCacheData() {
      return this.$store.getters["Events/billingCacheData"];
    },
    settings() {
      return JSON.parse(window.localStorage.getItem("aquila_captions"));
    },
  },
  methods: {
    settingArrivalDetails(val) {
      this.delegateForm.arrivaldetails = val;
      console.log(this.delegateForm);
    },
    dialogSetting(val) {
      this.delegateArrivaldialog = val;
    },
    updateRadio() {
      this.delegateType = this.delegateForm.delegateType;
    },
    verify: function (type) {
      let isValid = true;
      let invalidKey = "";
      for (const key in this.delegateRules) {
        console.log(this.$refs[key]);
        isValid = isValid
          ? this.$refs[key]
            ? this.$refs[key].validate(true)
            : true
          : false;
        if (!isValid && key === "phone") {
          isValid = true;
          break;
        }
        if (!isValid) {
          invalidKey = key.toUpperCase();
          break;
        }
      }

      if (isValid) {
        this.saveDelegate(type);
      } else {
        this.errorAlert = {
          show: true,
          message: `${invalidKey} is a required field`,
        };
      }
    },
    closeAlert() {
      this.errorAlert = { show: false, message: "" };
    },
    resetDelegateForm: function () {
      this.delegateForm = {
        email: "",
        name: "",
      };
      this.errorAlert = { show: false, message: "" };
    },
    saveDelegate: function (type) {
      const delegateForm = { ...this.delegateForm };

      const data = {
        booking: this.$route.params.no,
        address: delegateForm.address,
        email: delegateForm.email,
        name: delegateForm.name,
        phone: delegateForm.phone,
        gender: delegateForm.gender,
        bookingDate: new Date(),
      };

      this.$store.dispatch("Events/saveDelegate", data);

      setTimeout(() => {
        type === "close" ? this.closeDialog() : this.resetDelegateForm();
      }, 300);
    },
    addPackagesToFormData: function (val) {
      this.delegateForm.bookingDelegatesPackage = val;
    },
    initBookingProfile(profile) {
      const contacts = profile
        ? profile.contactsEntity.filter((c) => c.Status == "Active")[0]
        : null;
      const emergencyContacts = profile
        ? profile.contactsEntity.filter((item) => item.Type === "Emergency")
        : null;
      const workExp = profile.workexp
        ? profile.workexp.filter((item) => item.Current).shift()
        : null;
      this.delegateForm.eventNo = this.event.no;
      this.delegateForm.delegateType =
        profile.MemberNo && profile.MemberNo !== "" ? "Member" : "Non-Member";
      this.updateRadio();
      this.delegateForm.email = contacts ? contacts.Email : "";
      this.delegateForm.idNo = profile.IdentificationDocumentNo || "";
      this.delegateForm.gender = profile.Gender || "";
      this.delegateForm.memberNo = profile.MemberNo || "";
      this.delegateForm.name =
        `${profile.FirstName} ${profile.SecondName} ${profile.LastName}` ||
        profile.name ||
        "";
      this.delegateForm.phoneNo = contacts ? contacts.PhoneNo : "";
      this.delegateForm.address = contacts ? contacts.Address : "";
      this.delegateForm.currencyCode = this.event.currencyCode;
      this.delegateForm.delegateCompany = workExp ? workExp.NameOfFirm : "";
      this.delegateForm.contacts = emergencyContacts;
      this.delegateForm.discipline = profile.discipline;
      this.delegateForm.membershipCategory = profile.MemberShipType;
      this.delegateForm.countryCode = profile.Nationality;
      this.filteredCounties(this.delegateForm.countryCode);
      this.delegateForm.county = contacts ? contacts.County : "";
      this.category = profile.MemberShipType;
      this.delegateForm.arrivaldetails = "";
    },
  },
  watch: {
    profile: {
      handler: function (profile) {
        this.initBookingProfile(profile);
      },
    },

    "delegateForm.delegateType": {
      handler: function () {
        if (this.delegateForm.delegateType === "Non-Member") {
          this.delegateForm.eventNo = this.event.no;
        }
      },
    },

    eventDelegate: {
      handler: function (eventDelegate) {
        if (eventDelegate) {
          if (this.$route.params.id !== undefined)
            this.delegateForm = {
              ...this.eventDelegate[parseInt(this.$route.params.id)],
            };
        }
      },
      deep: true,
    },

    event: {
      handler: function (event) {
        this.delegateForm.attendanceType = event.isWebinar
          ? "Virtual"
          : "Physical";
      },
      deep: true,
    },
  },
};
</script>
<style src="vue-tel-input/dist/vue-tel-input.css"></style>
<style>
div.addArrivaltime {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 2rem;
}
</style>
