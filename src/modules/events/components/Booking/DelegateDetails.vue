<template>
  <div>
    <v-card flat class="mx-auto">
      <v-card-text
        :class="`${$vuetify.breakpoint.mobile ? 'mb-10 pb-10' : ''}`"
      >
        <v-row no-gutters>
          <v-col cols="12" md="4" sm="12" lg="4">
            <v-flex class="mt-n3" active-class="primary lighten-1" mandatory>
              <v-radio-group
                v-model="delegateForm.delegateType"
                @change="updateRadio"
              >
                <template v-if="memberIntheParam">
                  <v-radio
                    v-for="(item, i) in memberTypes.slice(0, 1)"
                    :key="i"
                    :value="item.value"
                    :label="item.label"
                    color="primary"
                    style="label-color: #333"
                  >
                  </v-radio>
                </template>
                <template v-else>
                  <v-radio
                    v-for="(item, i) in memberTypes"
                    :key="i"
                    :value="item.value"
                    :label="item.label"
                    color="primary"
                    style="label-color: #333"
                  >
                  </v-radio>
                </template>
              </v-radio-group>
            </v-flex>
          </v-col>
          <v-col cols="12" md="4" sm="12" lg="4">
            <div class="d-flex flex-column">
              <div
                :class="$vuetify.breakpoint.mobile ? '' : `align-self-center`"
              >
                <v-flex class="mt-n3" active-class="primary lighten-1">
                  <v-radio-group v-model="delegateForm.attendanceType">
                    <template v-for="(item, i) in attendanceTypes">
                      <v-radio
                        :key="i"
                        :value="item.value"
                        :label="item.label"
                        filter
                        color="primary"
                        v-if="isVirtual && item.value !== 'Virtual'"
                      >
                      </v-radio>
                      <v-radio
                        :key="i"
                        :value="item.value"
                        :label="item.label"
                        filter
                        color="primary"
                        v-else-if="isPhysical && item.value !== 'Physical'"
                      >
                      </v-radio>
                      <v-radio
                        :key="i"
                        :value="item.value"
                        :label="item.label"
                        filter
                        color="primary"
                        v-else-if="isHybrid"
                      >
                      </v-radio>
                    </template>
                  </v-radio-group>
                </v-flex>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" sm="12" lg="4">
            <div class="d-flex flex-column">
              <div :class="$vuetify.breakpoint.mobile ? '' : `align-self-end`">
                <v-flex class="mt-n3" active-class="primary lighten-1">
                  <v-radio-group v-model="currency">
                    <v-radio
                      v-for="(item, i) in foreignTypes"
                      :key="i"
                      :value="item.value"
                      :label="item.label"
                      filter
                      color="primary"
                    >
                    </v-radio>
                  </v-radio-group>
                </v-flex>
              </div>
            </div>
          </v-col>
        </v-row>
        <div v-if="delegateType === 'Member' || memberIntheParam" class="mt-n2">
          <div class="primary--text">
            {{
              `${
                delegateType === "Member"
                  ? "Search to Continue"
                  : "Enter Delegate Details"
              }`
            }}
          </div>
          <v-alert type="info" dense text>
            <ul>
              <li v-for="(item, i) in setupDisclaimer" :key="i">
                {{ item.description }}
              </li>
              <li v-for="(item, i) in eventDisclaimer" :key="i">
                {{ item.description }}
              </li>
            </ul>
          </v-alert>
          <v-text-field
            label=""
            color="primary"
            v-model="search"
            placeholder="Search by Member No / ID or Passport"
            outlined
            dense
            @keyup.enter="searchProfile"
            :class="`${
              $vuetify.breakpoint.mdAndUp
                ? 'search-member'
                : 'search-member-mobile'
            }`"
            ref="searchField"
            :rules="company === 'IEK' ? delegateRules.searchRules : []"
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
                {{ $vuetify.breakpoint.mobile ? "" : "Search Member" }}
                <v-icon class="mx-2">mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>
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
        <div
          class="mt-2"
          v-if="
            delegateForm.delegateType !== null &&
            delegateForm.attendanceType !== null
          "
        >
          <v-form ref="delegateForm" id="delegateForm" v-model="isValid">
            <v-row dense>
              <!--Member Number-->
              <v-col
                cols="12"
                md="3"
                v-show="delegateType === 'Member' || memberIntheParam"
              >
                <div>
                  Member No <span class="mx-2" style="color: red">*</span>
                </div>
                <v-text-field
                  ref="memberNo"
                  :rules="
                    delegateType === 'Member' ? delegateRules.memberNo : []
                  "
                  :disabled="delegateForm.delegateType === '' || isMember"
                  v-model="delegateForm.memberNo"
                  placeholder="Member No"
                  validate-on-blur
                  outlined
                  dense
                  prepend-inner-icon="search"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >account_box</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>

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
                  :disabled="delegateForm.delegateType === ''"
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

              <!--ID/Passport-->
              <v-col
                cols="12"
                md="3"
                :class="$vuetify.breakpoint.mobile ? 'mt-n4' : ''"
              >
                <div>
                  Enter ID/Passport No.<span class="mx-2" style="color: red"
                    >*</span
                  >
                </div>
                <v-text-field
                  ref="idNo"
                  :rules="delegateRules.idNo"
                  :disabled="
                    (delegateForm.delegateType === '' || isMember) &&
                    profile.IdentificationDocumentNo !== ''
                  "
                  v-model="delegateForm.idNo"
                  placeholder="ID number/Passport Number"
                  validate-on-blur
                  outlined
                  dense
                  clearable
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >badge</v-icon
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
                  :disabled="delegateForm.delegateType === ''"
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
                  :disabled="delegateForm.delegateType === ''"
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
                  v-model="delegateForm.phoneNo"
                  mode="international"
                  required="true"
                  :valid-characters-only="true"
                  :input-options="inputOptions"
                ></vue-tel-input>
                <!-- <VueTelInput
                  type="tel"
                  
                  :rules="delegateRules.phoneNo"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateForm.phoneNo"
                  placeholder="Phone Number"
                  validate-on-blur
                  outlined
                  dense
                  clearable
                /> -->
                <!-- <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >phone</v-icon
                    >
                  </template>
                </VueTelInput> -->
              </v-col>
              <!-- address -->
              <v-col
                cols="12"
                md="3"
                class="mt-n4"
                v-show="delegateForm.delegateType !== 'Member'"
              >
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
              <v-col cols="12" md="3" class="mt-n4">
                <div>
                  Enter Your Country
                  <span class="mx-2" style="color: red">*</span>
                </div>
                <v-autocomplete
                  ref="country"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateForm.countryCode"
                  :items="countries"
                  :item-value="(item) => item.code"
                  :item-text="(item) => item.displayName"
                  placeholder="Country"
                  outlined
                  dense
                  clearable
                  validate-on-blur
                  :rules="delegateRules.country"
                  @change="filteredCounties(delegateForm.countryCode)"
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
                class="mt-n4"
                v-if="company === 'IEK' && countiesList.length > 0"
              >
                <div>
                  Enter Your County
                  <span class="mx-2" style="color: red">*</span>
                </div>
                <v-autocomplete
                  ref="county"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateForm.county"
                  :items="countiesList"
                  :item-value="(item) => item.CountyNo"
                  :item-text="(item) => item.countyName"
                  placeholder="County"
                  outlined
                  dense
                  clearable
                  validate-on-blur
                  :rules="delegateRules.county"
                />
              </v-col>
              <!-- discipline -->
              <v-col cols="12" md="3" class="mt-n4" v-if="isDiscipline">
                <div>
                  Discipline
                  <span class="mx-2" style="color: red">*</span>
                </div>
                <v-autocomplete
                  ref="discipline"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateForm.discipline"
                  :items="disciplines"
                  :item-value="(item) => item.discipline"
                  :item-text="(item) => item.discipline"
                  placeholder="Select Discipline"
                  outlined
                  dense
                  clearable
                  validate-on-blur
                  :rules="isDiscipline ? delegateRules.discipline : []"
                />
              </v-col>
              <!-- ebk member number -->
              <v-col
                cols="12"
                md="6"
                class="mt-n4"
                v-show="isEbkNumberRequired"
              >
                <div>
                  Enter EBK Number (Input NA if not registered)
                  <span class="mx-2" style="color: red">*</span>
                </div>
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
              <!-- organisation -->
              <v-col cols="12" :md="isDiscipline ? '6' : '3'" class="mt-n4">
                <div>
                  Organisation
                  <span class="mx-2" style="color: red">*</span>
                </div>
                <v-text-field
                  v-model="delegateForm.delegateCompany"
                  :rules="delegateRules.delegateCompany"
                  :disabled="delegateForm.delegateType === ''"
                  ref="delegateCompany"
                  placeholder="Company"
                  validate-on-blur
                  outlined
                  dense
                  clearable
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >mdi-office-building-marker</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <div class="addArrivaltime">
              <v-btn
                color="primary"
                class="px-6"
                @click="dialogSetting(true)"
                v-if="
                  currency !== 'Local' &&
                  delegateForm.attendanceType === 'Physical'
                "
              >
                <!-- currency !== 'Local' && -->
                <v-icon class="mr-6">mdi-clock</v-icon>
                Add your arrival time
              </v-btn>
            </div>
            <EmergencyDialog
              v-if="isEmergencyRequired"
              :event="currentEvent"
              :delegate-form="delegateForm"
              :emergency-contacts="delegateForm.contacts"
              @addEmergencyContact="addEmergencyContact"
              @removeEmergencyContact="removeEmergencyContact"
              @editEmergencyContact="editEmergencyContact"
            />
          </v-form>
        </div>
        <delegate-packages
          :delegate-form="delegateForm"
          @addPackagesToFormData="addPackagesToFormData"
          @updateDelegateCurrency="setCurrency"
          :currency="currency"
          :category="category"
          :selected-currency="selectedCurrency"
        />
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
            :disabled="
              (delegateForm.delegateType === null &&
                delegateForm.attendanceType === null) ||
              delegateForm.bookingDelegatesPackage.length === 0 ||
              $route.params.id !== undefined
            "
            outlined
            class="white--text pa-2"
            @click="verify('clear')"
            >{{ settings.SaveAndClear }}</v-btn
          >
          <v-btn
            color="primary"
            :disabled="
              (delegateForm.delegateType === null &&
                delegateForm.attendanceType === null) ||
              delegateForm.bookingDelegatesPackage.length === 0
            "
            class="white--text pa-2 ml-2"
            @click="verify('close')"
            >{{ settings.SaveAndClose }}</v-btn
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
import DelegatePackages from "./DelegatePackages.vue";
import EmergencyDialog from "./EmergencyDialog.vue";
import { isDiscipline } from "@/environment/environment";
import { AuthService } from "@/modules/auth";
// import EventBus from "../../../../utilities/eventBus";
import { VueTelInput } from "vue-tel-input";
import DelegateArrivalVue from "./DelegateArrival.vue";

export default {
  name: "DelegateForm",
  mixins: [bookingMixin],
  components: {
    DelegatePackages,
    EmergencyDialog,
    VueTelInput,
    DelegateArrivalVue,
  },
  data() {
    return {
      delegateArrivaldialog: false,
      inputOptions: {
        showDialCode: true,
      },
      countiesList: [],
      delegateType: "Member",
      selectedCurrency: null,
      category: "",
      search: "",
      isValid: false,
      alert: {
        show: false,
        message: "",
      },
      currency: "Local",
      delegateForm: {
        eventNo: "",
        amountExclVAT: 0,
        amountInclVAT: 0,
        vatAmount: 0,
        pdelegate: true,
        delegateType: "Member",
        email: "",
        idNo: "",
        gender: "",
        memberNo: "",
        name: "",
        phoneNo: "",
        delegateCompany: "",
        address: "",
        referenceNo: "",
        membershipCategory: "",
        country: "",
        attendanceType: "Physical",
        discipline: "",
        bookingDelegatesPackage: [],
        contacts: [],
        delegateContact: [],
        county: "",
        currencyCode: "",
        arrivaldetails: "",
      },
      attendanceTypes: [
        { label: "Physical", value: "Physical" },
        { label: "Virtual", value: "Virtual" },
      ],
      memberTypes: [
        { label: "Member", value: "Member" },
        { label: "Non-Member", value: "Non-Member" },
      ],
      foreignTypes: [
        { label: "Local", value: "Local" },
        { label: "Foreign", value: "Foreign" },
      ],
      company: process.env.VUE_APP_ORG_NAME,
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
          user.IdentificationDocumentNo = user.id_number;
          const userDetails = user.profile ? user.profile : user;
          userDetails.contacts = [
            {
              Email: userDetails.Email,
              PhoneNo: userDetails.PhoneNo ?? "",
              Address: userDetails.Address ?? "",
              County: userDetails.county ?? "",
            },
          ];
          this.initBookingProfile(userDetails);
        }
      }
    }
  },
  computed: {
    memberIntheParam() {
      return this.$route.params.member ? true : false;
    },
    isEmergencyRequired() {
      return !this.event.isWebinar;
    },
    isMember() {
      return this.delegateForm.delegateType === "Member";
    },
    isPhysical() {
      return this.event
        ? this.event.eventPackageCost
          ? this.event.eventPackageCost.filter(
              (el) => el.attendanceType === "Virtual"
            ).length > 0
          : false
        : false;
    },
    isVirtual() {
      return this.event
        ? this.event.eventPackageCost
          ? this.event.eventPackageCost.filter(
              (el) => el.attendanceType === "Physical"
            ).length > 0
          : false
        : false;
    },
    isHybrid() {
      return this.isPhysical && this.isVirtual;
    },
    isEbkNumberRequired() {
      return process.env.VUE_APP_EBK_NUMBER_REQUIRED;
    },
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
        idNo: [(v) => !!v || "ID/Passport is required."],
        gender: [(v) => !!v || "Gender is required."],
        delegateCompany: [(v) => !!v || "Company is required."],
        discipline: [(v) => !!v || "Engineering Discipline is required."],
        email: [
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid e-mail.";
          },
        ],
        phoneNo: [(v) => !!v || "Phone Number is required."],
        country: [(v) => !!v || "Country is required."],
        county: [(v) => !!v || "County is required."],
        searchRules: [
          (v) => {
            const pattern = /^[a-zA-Z]+\./;
            return (
              pattern.test(v) ||
              "Invalid member number, Member Number must start with a letter and a dot. e.g. G.10000"
            );
          },
        ],
        referenceNo: [
          (v) => {
            return this.isEbkNumberRequired
              ? !!v || "EBK number is required."
              : true;
          },
        ],
      };
    },
    isDiscipline() {
      return isDiscipline;
    },
    profile() {
      return this.$store.getters["Events/profile"];
    },
    loadingSearch() {
      return this.$store.getters["Events/loadingSearch"];
    },
    event() {
      return this.$store.getters["Events/event"];
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
    eventDisclaimer() {
      return this.event.disclaimer
        ? this.event.disclaimer.filter(
            (item) => item.disclaimerType === "Events"
          )
        : "";
    },
    setupDisclaimer() {
      return this.$store.getters["Events/disclaimers"].filter(
        (item) =>
          (item.documentNo === "" && item.disclaimerType === "Events") ||
          (item.documentNo === this.booking.bookingNo &&
            item.disclaimerType === "Events")
      );
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
    setCurrency(val) {
      this.delegateForm.currencyCode = val;
    },
    searchProfile: function () {
      if (this.$refs.searchField.validate(true)) {
        if (this.search === "") return;
        this.$store.dispatch("Events/searchProfile", this.search.trim());
      }
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
        if(!isValid && key === "phoneNo") {
          isValid =true;
          break;
        }
        if (!isValid) {

          invalidKey = key.toUpperCase();
          break;
        }
      }

      if (isValid) {
        console.log("Validated now");
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
        eventNo: "",
        amountExclVAT: 0,
        amountInclVAT: 0,
        vatAmount: 0,
        city: "",
        county: "",
        delegateType: "Member",
        attendanceType: "Physical",
        email: "",
        idNo: "",
        memberNo: "",
        name: "",
        phoneNo: "",
        address: "2345",
        delegateContact: [],
        bookingDelegatesPackage: this.delegateForm.bookingDelegatesPackage,
        arrivaldetails: "",
      };
      this.errorAlert = { show: false, message: "" };
    },
    addEmergencyContact(item) {
      this.delegateForm.delegateContact.push(item);
    },
    removeEmergencyContact(index) {
      this.delegateForm.delegateContact.splice(index, 1);
    },
    editEmergencyContact(item) {
      this.delegateForm.delegateContact[item.index] = item;
    },
    saveDelegate: function (type) {
      console.log(type);
      const delegateForm = { ...this.delegateForm };
      const isBooking = this.isBookingView && this.booking.status === "Open";
      delegateForm.isFirstDelegate = !isBooking;
      // TODO: Remove this hack once the billing is fixed
      // const referenceNo = this.billingCacheData.billingType
      //   ? this.billingCacheData.billingType === 'corporate'
      //     ? this.billingCacheData.referenceNo
      //     : delegateForm.memberNo
      //   : delegateForm.memberNo;
      const data = {
        bookingDateTime: isBooking ? this.booking.bookingDateTime : new Date(),
        eventNo: this.event.no,
        eventDelegate: delegateForm,
        address: delegateForm.address,
        currencyCode: delegateForm.currencyCode,
        city: delegateForm.city,
        county: delegateForm.county,
        email: delegateForm.email,
        idNo: delegateForm.idNo,
        names: delegateForm.name,
        phoneNo: delegateForm.phoneNo, // Place member no on phone then substitute later on billing
        referenceNo: delegateForm.memberNo, // delegateForm.memberNo, //Hack to allow Members to book untill sorted in BC
        memberNo: delegateForm.memberNo,
        bookingNo: this.decryptedRoute.query.bookingNo,
        bookingType: delegateForm.delegateType,
        gender: delegateForm.gender,
        discipline: delegateForm.discipline,
        countryCode: delegateForm.countryCode,
        type,
        dateOfArrival: delegateForm.arrivaldetails,
      };
      console.log(data);
      if (this.$route.params.id !== undefined) {
        this.$store.dispatch("Events/updateDelegate", data);
      } else {
        this.$store.dispatch("Events/saveDelegate", data);
      }
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
