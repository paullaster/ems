<!-- eslint-disable vue/no-parsing-error -->
<template>
  <v-container fluid>
    <v-row no-gutters flat v-if="event.description">
      <v-col cols="12" md="9" lg="9" sm="12">
        <v-card class="mx-auto mb-10" flat rounded tile>
          <v-card-title v-if="!isBookingView">
            <v-icon class="mr-2" color="primary">mdi-calendar</v-icon>
            <span class="primary--text" v-if="event.description"
              >{{ event.description.substring(0, 100) }}
              {{ event.description.length > 100 ? "..." : "" }}
            </span>
          </v-card-title>
          <BookingViewTop
            v-if="isBookingView"
            :booking="booking"
            :cpd-event="event"
          />
          <v-responsive class="mx-auto" max-width="968px">
            <div
              :class="`${
                $vuetify.breakpoint.mobile ? '' : 'd-flex justify-space-between'
              }`"
            >
              <div class="text-lg-h6 ml-2">
                {{ isBookingView ? "Booked" : "Booking" }} Delegates
              </div>
              <div
                :class="`d-flex ${
                  $vuetify.breakpoint.mobile ? 'flex-column' : ''
                }`"
              >
                <div class="mx-3">
                  <v-text-field
                    append-icon="mdi-magnify"
                    single-line
                    filled
                    placeholder="Search"
                    dense
                    class="search"
                    v-model="search"
                  ></v-text-field>
                </div>
                <div>
                  <v-btn
                    @click="addDelegate()"
                    color="primary"
                    :block="$vuetify.breakpoint.mobile"
                    class="text-capitalize"
                    :disabled="isUpdateDelegate"
                  >
                    <v-icon class="mx-2">mdi-plus</v-icon>
                    {{ settings.ClickHereToAddDelegate }}
                  </v-btn>
                </div>
              </div>
            </div>
            <v-data-table
              v-model="primaryDelegate"
              :headers="headers"
              :items="maskEventDelegates(eventDelegate)"
              light
              calculate-widths
              :single-select="true"
              item-key="idNo"
              show-select
              class="elevation-0"
              :search="search"
              :items-per-page="5"
            >
              <template v-slot:item.no="{ item, index }">
                <span class="primary--text">{{ index + 1 }}</span>
              </template>
              <template v-slot:item.amountExclVAT="{ item }">
                <span>{{
                  booking.currencyCode === "KES" || booking.currencyCode === ""
                    ? item.amountExclLCY
                    : item.amountExclVAT
                }}</span>
              </template>
              <template v-slot:item.amountInclVAT="{ item }">
                <span>{{
                  booking.currencyCode === "KES" || booking.currencyCode === ""
                    ? item.amountInclLCY
                    : item.amountInclVAT
                }}</span>
              </template>
              <template v-slot:item.data-table-select="{ item, isSelected }">
                <v-simple-checkbox
                  @input="setPrimaryDelegate(item)"
                  color="primary"
                  :value="isSelected"
                  :disabled="isSelected || booking.status !== 'Open'"
                ></v-simple-checkbox>
              </template>
              <template v-slot:item.actions="{ item, index }">
                <v-menu offset-y min-width="100">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" :attrs="attrs" icon>
                      <v-icon size="25">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item
                      dense
                      v-for="(action, i) in actions"
                      :key="i"
                      :disabled="
                        action.disabled || isPrimaryDelegate(item, action.text)
                      "
                      @click="action.action(item, index)"
                    >
                      <v-list-item-icon>
                        <v-icon :color="action.iconColor" size="20">{{
                          action.icon
                        }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ action.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-responsive>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" lg="3" sm="12">
        <v-card class="mx-auto" tile height="100vh" v-if="!booking.billed">
          <v-card-title> Total Booking Amount </v-card-title>
          <v-card-text>
            <v-main class="text-right overline">
              Total Excl. VAT:
              <strong class="font-weight-black">
                {{
                  booking.currencyCode === "KES" || booking.currencyCode === ""
                    ? booking.amountExclLCY
                    : booking.amountExclVAT
                }}
              </strong>
              <br />
              Total Inc VAT:<strong class="font-weight-black">
                {{
                  booking.currencyCode === "KES" || booking.currencyCode === ""
                    ? booking.amountInclLCY
                    : booking.amountInclVAT
                }}
              </strong>
            </v-main>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              class="text-capitalize mt-7"
              :disabled="
                (booking.status !== 'Open' &&
                  (booking.amountExclLCY === 0 ||
                    booking.amountInclLCY === 0)) ||
                !isBookingView
              "
              @click="goToBilling()"
              width="100%"
            >
              <v-icon class="mx-2">mdi-check</v-icon>
              {{ settings.ProceedToCheckout }}
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="mx-auto" tile height="100vh" v-else>
          <v-card-title> Total Billed Amount </v-card-title>
          <v-card-text>
            <v-main class="text-right overline">
              Total Billed. Amount
              <strong class="font-weight-black">
                {{ booking.amountBilled | currencyFormat }}
              </strong>
            </v-main>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="9" lg="9" sm="12">
        <v-card>
          <v-skeleton-loader
            type="card-heading, list-item-two-line, table"
          ></v-skeleton-loader>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" lg="3" sm="12">
        <v-card>
          <v-skeleton-loader type="card-heading, table"></v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-card-actions class="mb-10"></v-card-actions>
  </v-container>
</template>
<script>
import BookingViewTop from "./BookingViewTop";
import bookingMixin from "./bookingMixin";
import AuthService from "@/modules/auth/AuthService";

export default {
  name: "Booking",
  mixins: [bookingMixin],
  components: {
    BookingViewTop,
  },
  data() {
    return {
      search: "",
      menu: false,
      bookingView: false,
      primaryDelegate: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((v) => {
      if (!AuthService.check() && process.env.VUE_APP_ENABLE_LOGIN === "true") {
        v.$router.push({
          name: "Login",
          params: { no: to.params.no },
        });
      }
      v.$store.dispatch("Events/getCountries");
      v.$store.dispatch("Events/getCounties");
      v.$store.dispatch("Events/getDisciplines");
      v.$store.dispatch("Events/getDisclaimers");
      const bookingNo =
        v.decryptedRoute.query.bookingNo === undefined
          ? v.decryptedRoute.params.bookingNo
          : v.decryptedRoute.query.bookingNo;
      if (bookingNo !== undefined) {
        v.viewBooking(bookingNo);
      } else {
        v.$store.dispatch("Events/getEvent", v.decryptedRoute.params.no);
      }
    });
  },
  computed: {
    headers: function () {
      return [
        {
          text: "No.",
          value: "no",
          align: "start",
          sortable: true,
        },
        {
          text: "Name",
          value: "name",
          align: "start",
          sortable: true,
        },
        {
          text: "Delegate Type",
          value: "delegateType",
          align: "start",
          sortable: true,
        },
        {
          text: "Id Number",
          value: "idNo",
          align: "start",
          sortable: true,
        },
        {
          text: "Total Excl. VAT",
          value: "amountExclVAT",
          align: "start",
          sortable: true,
        },
        {
          text: "Total Incl. VAT",
          value: "amountInclVAT",
          align: "start",
          sortable: true,
        },
        {
          text: "Bill To",
          value: "data-table-select",
          align: "start",
          sortable: true,
        },
        {
          text: "Actions",
          value: "actions",
          align: "start",
          sortable: true,
        },
      ];
    },
    actions: function () {
      return [
        {
          text: "Edit",
          disabled: this.isUpdateDelegate,
          icon: "mdi-pencil",
          iconColor: "indigo",
          action: (item, index) => {
            this.$root.routeTo({
              name: "DelegateCard",
              params: {
                no: this.event.no,
                id: index,
              },
              query: {
                bookingNo: item.bookingNo ? item.bookingNo : null,
              },
            });
          },
        },
        {
          text: "Remove",
          disabled: this.isUpdateDelegate,
          icon: "mdi-delete",
          iconColor: "deep-orange",
          action: (item, index) => {
            if (item.bookingNo) {
              this.cancelDelegate(item.delegateNo, index);
            } else {
              this.$store.commit("Events/REMOVE_DELEGATE", index);
            }
          },
        },
      ];
    },
    isUpdateDelegate() {
      return this.$route.name === "BookingView"
        ? this.booking.paid || this.booking.status !== "Open"
        : false;
    },
    isBookingView() {
      return (
        this.$route.name === "BookingView" ||
        this.decryptedRoute.query.bookingNo !== undefined
      );
    },
    delegates() {
      let del = this.booking ? this.booking.eventDelegate : [];
      return del.filter((d) => {
        return d.status !== "Cancelled";
      });
    },
    settings() {
      return JSON.parse(window.localStorage.getItem("aquila_captions"));
    },
  },
  methods: {
    goToBilling() {
      this.$router.replace({
        name: "billing",
        params: {
          bookingNo: this.$route.params.bookingNo,
        },
      });
    },
    addDelegate() {
      this.$root.routeTo({
        name: "DelegateCard",
        params: {
          no: this.event.no,
        },
        query: {
          bookingNo: this.booking.bookingNo
            ? this.booking.bookingNo
            : undefined,
        },
      });
    },
    viewBooking(bookingNo) {
      this.bookingView = true;
      this.$store.dispatch("Events/getBooking", bookingNo);
    },
    cancelDelegate: function (delegateNo, index) {
      this.$confirm.show({
        title: "Remove Delegate",
        text: `Are you sure you want remove this delegate ?`,
        onConfirm: () => {
          this.$store.dispatch("Events/cancelDelegate", {
            bookingNo: this.booking.bookingNo,
            eventNo: this.event.no,
            email: this.booking.email,
            delegateNo: delegateNo,
            cpdEvent: this.eventBAsicInfo(),
            index,
          });
        },
      });
    },
    eventBAsicInfo: function () {
      let basic = { ...this.event };
      delete basic.eventPackageCost;
      delete basic.eventProviders;
      delete basic.eventsDocuments;

      return basic;
    },
    isPrimaryDelegate: function (delegate, action) {
      return delegate.idNo === this.booking.idNo && action !== "Edit";
    },
    setPrimaryDelegate: function (delegate) {
      if (delegate.idNo !== this.booking.idNo) {
        this.primaryDelegate = delegate;
        this.$confirm.show({
          title: "Set Bill To Delegate",
          text: `Are you sure you want to set ${delegate.name} as the bill to delegate ?`,
          onConfirm: () => {
            this.$store.dispatch("Events/setPrimaryDelegate", {
              bookingNo: this.booking.bookingNo,
              eventNo: this.event.no,
              idNo: delegate.idNo,
              names: delegate.name,
              discipline: delegate.discipline,
              referenceNo: delegate.memberNo,
              email: delegate.email,
              phoneNo: delegate.phoneNo,
              countryCode: delegate.countryCode,
              profileID: delegate.profileID,
              bookingType: delegate.delegateType,
            });
          },
        });
      }
    },
    maskEventDelegates: function (delegates) {
      return delegates.map((d) => {
        return {
          ...d,
          idNo: this.maskString(d.idNo),
        };
      });
    },
  },
  watch: {
    booking: function (val) {
      if (val) {
        this.primaryDelegate = val.eventDelegate.filter(
          (d) => d.idNo === val.idNo
        );
        this.$store.dispatch("Events/getEvent", val.eventNo);
      }
    },
  },
};
</script>
<style>
.search > .v-input__control > .v-input__slot::before {
  border-style: none !important;
}
</style>
