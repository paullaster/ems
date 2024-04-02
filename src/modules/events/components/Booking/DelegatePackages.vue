<template>
  <div>
    <div class="text-lg-h6 mt-n1 d-flex justify-space-between">
      <div>Select Delegate Package</div>
      <div>
        <v-autocomplete
          :items="currencies"
          :label="`${currency === 'Local' ? '' : 'Select'} Currency`"
          outlined
          dense
          :disabled="currency === 'Local'"
          v-model="selectedCurrency"
        >
          <template v-slot:prepend-inner>
            <v-icon class="mt-2">mdi-cash</v-icon>
          </template>
        </v-autocomplete>
      </div>
    </div>
    <div>
      <div class="packagesPod">
        <!-- For mobile devices, occupyfull width-->
        <!-- For small screens and above, occupy 6 columns -->
        <v-row>
          <v-col v-for="(item, i) in eventPackages" :key="i" cols="12" sm="6">
            <v-list-item
              v-if="!item.hideCost"
              :disabled="
                (item.mandatory && item.defaultPackage) || !isFormValid
              "
            >
              <v-checkbox v-model="selectedPackages" :value="i"></v-checkbox>
              <v-list-item-content class="list-item-content">
                <div class="list-item-info">
                  <v-list-item-title>
                    {{ item.description }} :
                    {{
                      currency === "Local" || selectedCurrency === "KES"
                        ? "KES"
                        : selectedCurrency
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="isEarlyBird(item)">
                    {{ getEarlyBirdAmount(item) | currencyFormat }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    {{ getAmount(item) | currencyFormat }}
                  </v-list-item-subtitle>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </div>

      <!-- <div class="packagesPod">
        <v-chip-group
          v-model="selectedPackages"
          column
          multiple
          active-class="primary lighten-4 primary--text text--darken-4"
        >
          <v-chip
            filter
            v-for="(item, i) in eventPackages"
            :key="i"
            :disabled="(item.mandatory && item.defaultPackage) || !isFormValid"
          >
            {{ item.description }} : {{ item.currencyCode }}
            <span v-if="isEarlyBird(item)">
              {{ item.earlyBirdAmountInclVAT | currencyFormat }}
            </span>
            <span v-else>{{ item.amountIncludingVAT | currencyFormat }}</span>
          </v-chip>
        </v-chip-group>
      </div> -->
    </div>
  </div>
</template>
<script>
import bookingMixin from "./bookingMixin";
// import EventBus from "../../../../utilities/eventBus";
export default {
  name: "DelegatePackages",
  mixins: [bookingMixin],
  props: {
    delegateForm: {
      type: Object,
      default: () => ({}),
    },
    currency: {
      type: String,
      default: "Local",
    },
    category: {
      type: String,
      default: "",
    },
    selectedCurrency: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      selectedPackages: [],
      currencies: [],
      eventPackages: [],
      categories: [],
      isBooking: false,
      selectedPackagesArray: [],
    };
  },
  mounted() {
    console.log(this.selectedPackages);
    this.setPackages(this.event.eventPackageCost || []);
    if (this.$route.query.bookingNo && this.$route.params.id !== undefined) {
      this.isBooking = true;
    }
  },
  computed: {
    booking() {
      return this.$store.getters["Events/booking"];
    },
    isFormValid() {
      return this.delegateForm.idNo && this.delegateForm.idNo.length > 0;
    },
    delegateTotal() {
      const total = {
        amountExclVAT: 0,
        amountInclVAT: 0,
        vatAmount: 0,
      };
      this.selectedPackages.forEach((pack) => {
        total.amountExclVAT += pack.amountExclVAT;
        total.amountInclVAT += pack.amountInclVAT;
        total.vatAmount += pack.vatAmount;
      });

      return total;
    },
    computedProperties() {
      return [this.currency];
    },
  },
  methods: {
    isEarlyBird: function (eventPackage) {
      return new Date(eventPackage.earlyBirdCutoffDate) >= new Date();
    },
    setPackages: function (eventPackages) {
      this.eventPackages = this.event.eventPackageCost
        .filter((p) => p.attendanceType === this.delegateForm.attendanceType)
        .filter(
          (p) =>
            p.appliesType === this.delegateForm.delegateType ||
            p.appliesType === "" ||
            p.appliesType === " "
        )
        .filter(
          (p) =>
            p.membershipCategory === this.category ||
            p.membershipCategory === " " ||
            p.membershipCategory === ""
        );
      console.log(
        "set packages",
        this.event.eventPackageCost.filter(
          (p) => p.attendanceType === this.delegateForm.attendanceType
        )
      );
      eventPackages.forEach((p) => {
        if (!this.currencies.includes(p.currencyCode))
          this.currencies.push(p.currencyCode);

        if (p.membershipCategory !== "")
          if (!this.categories.includes(p.membershipCategory))
            this.categories.push(p.membershipCategory);
      });
      const hasLCY = this.currencies.includes("KES");
      if (this.currency === "Local" && !hasLCY) {
        this.currencies.push("KES");
        this.selectedCurrency = "KES";
      } else if (this.currency === "Local" && hasLCY) {
        this.selectedCurrency = "KES";
      } else {
        console.log(this.currencies[0]);
        this.selectedCurrency = this.currencies[0];
      }
    },
    removePackage: function (selectedPackage) {
      this.selectedPackages.splice(
        this.selectedPackages.findIndex(
          (p) => p.packageNo === selectedPackage.packageNo
        ),
        1
      );
    },
    updatePackage: function () {
      if (this.decryptedRoute.params.id !== undefined) {
        // updated selected packages by saved packages on edit
        const savedpackages = [];
        console.log(this.delegateForm);
        this.delegateForm.bookingDelegatesPackage.map((el, i) => {
          if (
            this.event.eventPackageCost.find(
              (a) => a.packageNo === el.packageCode
            ) !== undefined
          ) {
            savedpackages.push(i);
          }
        });
        this.selectedPackages = savedpackages;
      } else {
        this.selectedPackages = this.eventPackages
          .map((p, i) => {
            if (p.mandatory) {
              return i;
            }
          })
          .filter((el) => el !== undefined);
      }
    },
    updateByCategory() {
      // filter for member delegates
      // const isCategory = this.event.eventPackageCost.find(
      //   (p) => p.membershipCategory === this.category
      // );
      this.eventPackages = this.event.eventPackageCost
        .filter((p) => p.attendanceType === this.delegateForm.attendanceType)
        .filter(
          (p) =>
            p.appliesType === this.delegateForm.delegateType ||
            p.appliesType === "" ||
            p.appliesType === " "
        )
        .filter(
          (p) =>
            p.membershipCategory === this.category ||
            p.membershipCategory === " " ||
            p.membershipCategory === ""
        );
    },
    getBooking() {
      this.$store.dispatch(
        "Events/getBooking",
        this.decryptedRoute.params.bookingNo
      );
    },
    cancelPackage: function (packageNo, delegateNo) {
      this.$confirm.show({
        title: "Remove Package",
        text: `Are you sure you want remove this package ?`,
        onConfirm: () => {
          this.$store.dispatch("Events/cancelPackage", {
            bookingNo: this.booking.bookingNo,
            eventNo: this.cpdEvent.no,
            delegateNo: delegateNo,
            email: this.booking.email,
            packageCode: packageNo,
            cpdEvent: this.eventBAsicInfo(),
          });
        },
      });
    },
    getAmount(item) {
      if (this.currency === "Local") {
        this.selectedCurrency = "KES";
        return item.amountInclLCY;
      } else if (this.currency === "Foreign") {
        this.selectedCurrency = this.currencies.find((cur) => cur !== "KES");
        return item.amountIncludingVAT;
      } else {
        return item.amountInclLCY;
      }
    },
    getEarlyBirdAmount(item) {
      if (this.currency === "Local") {
        this.selectedCurrency = "KES";
        return item.earlyBirdAmountInclLCY;
      } else if (this.currency === "Foreign") {
        this.selectedCurrency = this.currencies.find((cur) => cur !== "KES");
        return item.earlyBirdAmountInclVAT;
      } else {
        return item.earlyBirdAmountInclLCY;
      }
    },
    updateTotal() {
      let selectedPackages = [
        ...this.selectedPackages.map((el) => {
          this.eventPackages[el].packageCode = this.eventPackages[el].packageNo;
          // this.eventPackages[el].currencyCode = this.selectedCurrency || "KES";
          return this.eventPackages[el];
        }),
      ];
      this.$store.commit(
        "Events/SET_SELECTED_AMOUNT",
        selectedPackages.reduce(
          (a, b) =>
            a +
            (this.isEarlyBird(b)
              ? this.getEarlyBirdAmount(b)
              : this.getAmount(b)),
          0
        )
      );

      this.selectedPackagesArray = selectedPackages;
      this.$emit("addPackagesToFormData", this.selectedPackagesArray);
    },
  },
  watch: {
    selectedPackages: {
      handler: function () {
        this.updateTotal();
      },
      deep: true,
    },
    "delegateForm.delegateType": function () {
      this.updateByCategory();
    },
    "delegateForm.attendanceType": function () {
      this.updateByCategory();
    },
    category: function () {
      console.log("updated category");
      this.updateByCategory();
    },
    event: {
      handler: function (event) {
        console.log(event);
        this.setPackages(event.eventPackageCost || []);
      },
      deep: true,
    },
    eventPackages: {
      handler: function () {
        this.updatePackage();
      },
      deep: true,
    },
    currency() {
      const hasLCY = this.currencies.includes("KES");
      if (this.currency === "Local" && !hasLCY) {
        this.currencies.push("KES");
        this.selectedCurrency = "KES";
      } else if (this.currency === "Local" && hasLCY) {
        this.selectedCurrency = "KES";
      } else {
        this.selectedCurrency = this.currencies[0];
      }
    },
    computedProperties: {
      handler(newValues, oldValues) {
        console.log(oldValues, newValues);
        console.log(this.selectedCurrency);
        this.$emit("updateDelegateCurrency", this.selectedCurrency);
        this.updateTotal();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style>
.list-item-content {
  display: flex;
  align-items: center;
}

.list-item-info * {
  /* background-color: red ; */
  /* flex: 1; */
  display: inline;
  /* gap: -20px; */
}
</style>
