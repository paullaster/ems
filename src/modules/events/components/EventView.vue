<template>
  <v-container
    fluid
    class="mx-auto"
    ref="eventViewContainer"
    :style="$vuetify.breakpoint.mdAndUp ? 'width: 75%' : 'width: 100%'"
  >
    <v-card flat class="mt-2">
      <v-row>
        <v-col cols="12" md="7">
          <v-card flat>
            <v-img
              :src="event?.image"
              :lazy-src="require(`@/assets/images/picture4.jpg`)"
              :height="$vuetify.breakpoint.mdAndUp ? '454px' : '224px'"
              :width="$vuetify.breakpoint.mdAndUp ? '800px' : '320px'"
              style="border-radius: 5px"
              class="mx-auto"
            />

            <!-- <v-card-title> Event Information </v-card-title> -->

            <v-card-text>
              <EventCountdown :start-date="getStartTime" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card flat class="mx-auto">
            <v-row no-gutters>
              <v-col cols="12" md="10">
                <!-- Description -->
                <div
                  class="text-capitalize text-wrap text-lg-h4 font-weight-bold"
                >
                  {{ event.description }}
                </div>
                <!-- Date and time -->
                <div>
                  <v-icon small>mdi-calendar-multiselect</v-icon>
                  <span> Upcoming: {{ formatDate(event.startDate, 6) }} </span>
                  <br />

                  <div v-if="event.venue !== 'Online'">
                    <a
                      class="text-capitalize mt-2 text-body-1 font-weight-bold text-justify text-decoration-none"
                      @click="
                        $vuetify.goTo('#map', {
                          duration: 500,
                          easing: 'easeInOutCubic',
                        })
                      "
                    >
                      <v-icon color="primary">mdi-map-marker</v-icon>
                      {{ event.venue }}
                    </a>
                  </div>

                  <span v-else class="font-weight-bold">{{ event.venue }}</span>
                </div>
              </v-col>
            </v-row>
            <!-- slots -->
            <v-list dense class="mt-n2">
              <v-list-item dense class="pa-0">
                <v-list-item-content class="stats">
                  <div class="textStyle">Slots Available</div>

                  <v-list-item-subtitle class="textStyle2">
                    150
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <template>
              <!-- Buttons -->
              <v-row dense>
                <v-col cols="6" md6 sm6>
                  <v-btn
                    depressed
                    @click="bookNow"
                    color="primary"
                    class="toggleButtons mx-2"
                    block
                  >
                    <v-icon left>book_online</v-icon>
                    Book now
                  </v-btn>
                </v-col>
              </v-row>
              <!--Event costs-->
              <v-card-title class="pb-0">Event Costs</v-card-title>
              <v-card-text>
                <v-list dense class="pa-0">
                  <v-list-item class="pa-0" dense ripple three-line>
                    <v-list-item-content>
                      <v-list-item-title class="text-button">
                        KES. {{ event.cost }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { helper } from "../../../utilities";
import eventMixin from "../eventMixin";
import "leaflet/dist/leaflet.css";
import EventCountdown from "./EventCountdown.vue";
import { company } from "../../../environment/environment";

export default {
  name: "EventView",
  components: {
    EventCountdown,
  },
  mixins: [eventMixin],
  data: function () {
    return {
      firstButtonIndex: 0,
      dialog: false,
      document: null,
      orgName: company,
    };
  },

  beforeRouteEnter(to, from, next) {
    next((v) => {
      v.$store.dispatch("Events/getEvent", v.$root.decryptRoute(to).params.no);
    });
  },

  mounted() {
    // scroll to top of page
    window.scrollTo(0, 0);
  },

  computed: {
    cpd_caption() {
      return process.env.VUE_APP_CPD_CAPTION;
    },

    getStartTime() {
      // combine startDate and startTime
      return this.event ? new Date(this.event.startDate) : new Date();
    },

    event() {
      return this.$store.getters["Events/event"];
    },

    decryptedRoute() {
      return this.$root.decryptRoute(this.$route);
    },
    settings() {
      return JSON.parse(window.localStorage.getItem("aquila_captions"));
    },
  },

  methods: {
    bookNow() {
      const data = {
        event: this.event.id,
      };
      this.$store.dispatch("Events/saveBooking", data);
    },
    fileMeta: function (file) {
      return {
        icon: helper.getFileIcon(file),
        color: helper.getFileIconColor(file),
      };
    },

    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },

    centerUpdate(center) {
      this.currentCenter = center;
    },

    images(number) {
      return require(`@/assets/images/picture${number}.jpg`);
    },

    closeDialog: function (val) {
      this.dialog = val;
    },
  },
  //fn -> watch for relatedEvent & dispatch action
  watch: {},
};
</script>
<style>
@import "../EventView.css";
</style>
