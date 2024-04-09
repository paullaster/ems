<!-- eslint-disable vue/no-parsing-error -->
<template>
  <v-container fluid>
    <v-row no-gutters flat v-if="event.description">
      <v-col cols="12" md="9" lg="9" sm="12">
        <v-card class="mx-auto mb-10" flat rounded tile>
          <v-card-title v-if="!isBookingView">
            <v-icon class="mr-2" color="primary">mdi-calendar</v-icon>
            <span class="primary--text" v-if="event.description"
              >{{ event?.description?.substring(0, 100) }}
              {{ event?.description?.length > 100 ? "..." : "" }}
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
                    add booking
                  </v-btn>
                </div>
              </div>
            </div>
            <v-data-table
              v-model="primaryDelegate"
              :headers="headers"
              :items="eventDelegate"
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
              <template v-slot:item.data-table-select="{ item, isSelected }">
                <v-simple-checkbox
                  @input="setPrimaryDelegate(item)"
                  color="primary"
                  :value="isSelected"
                  :disabled="isSelected || booking.status !== 'Open'"
                ></v-simple-checkbox>
              </template>
              <template v-slot:item.eventCost>
                <span>{{ booking?.balance }}</span>
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
              Total :<strong class="font-weight-black">
                {{
                  eventDelegate.length == 0
                    ? 0
                    : booking?.balance * eventDelegate.length
                }}
              </strong>
            </v-main>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              class="text-capitalize mt-7"
              :disabled="!eventDelegate.length"
              @click="setPaymentDialog"
              width="100%"
            >
              <v-icon class="mx-2">mdi-check</v-icon>
              checkout
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

    <PaymentDialog />
  </v-container>
</template>
<script>
import BookingViewTop from "./BookingViewTop";
import bookingMixin from "./bookingMixin";
import PaymentDialog from "./PaymentDialog.vue";

export default {
  name: "Booking",
  mixins: [bookingMixin],
  components: {
    BookingViewTop,
    PaymentDialog,
  },
  data() {
    return {
      search: "",
      menu: false,
      bookingView: false,
      primaryDelegate: [],
      delegates: [],
      currentEvent: {},
    };
  },
  beforeRouteEnter(to, from, next) {
    next((v) => {
      v.$store.dispatch("Events/getBooking", v.$route.params.no);
    });
  },
  computed: {
    booking() {
      return this.$store.getters["Events/booking"];
    },
    eventDelegate() {
      return this.$store.getters["Events/eventDelegate"];
    },
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
          text: "Email",
          value: "email",
          align: "start",
          sortable: true,
        },
        {
          text: "Gender",
          value: "gender",
          align: "start",
          sortable: true,
        },
        {
          text: "Total Incl. VAT",
          value: "eventCost",
          align: "start",
          sortable: true,
        },
        {
          text: "Address",
          value: "address",
          align: "start",
          sortable: true,
        },
        {
          text: "Actions",
          value: "actions",
          align: "start",
          sortable: false,
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
  },
  methods: {
    setPaymentDialog() {
      this.$store.dispatch("Events/getBooking", this.$route.params.no);
      this.$store.commit("Events/SET_PAYMENT_DIALOG", true);
    },
    addDelegate() {
      this.$root.routeTo({
        name: "DelegateCard",
        params: {
          no: this.event.id,
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
      console.log("hrer");
      console.log(delegates);
      console.log(this.$data);
      // return;
      // return delegates.map((d) => {
      //   return {
      //     ...d,
      //     idNo: this.maskString(d.idNo),
      //   };
      // });
    },
  },
};
</script>
<style>
.search > .v-input__control > .v-input__slot::before {
  border-style: none !important;
}
</style>
