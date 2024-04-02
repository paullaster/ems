<template>
  <v-dialog
    scrollable
    v-model="dialog"
    width="70%"
    :fullscreen="$vuetify.breakpoint.mobile"
    :content-class="`${$vuetify.breakpoint.mobile ? 'mobile' : ''}`"
  >
    <v-card class="mx-auto px-2" rounded>
      <v-card-title class="px-0">
        <span class="font-weight-black text-uppercase">Site-Visit Events</span>
        <v-spacer></v-spacer>
        <v-btn
          elevation="0"
          outlined
          color="deep-orange darken-4"
          fab
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card
        v-for="(event, i) in childEventDetails"
        :key="i"
        style="cursor: pointer"
        outlined
        elevation="0"
        class="my-2 mx-auto px-2"
        width="100%"
      >
        <v-row no-gutters>
          <v-col cols="12" md="9">
            <div class="mx- mt-5">
              <div
                class="dateText d-md-block d-sm-flex flex-row justify-center"
              >
                <span class="font-weight-medium">{{ event.description }}</span>
                |
                <span class="mr-2 text-body-1"
                  >From
                  {{
                    getFormattedDate(
                      formatForISO(event.startDate, event.startTime)
                    )
                  }}
                  To
                  {{
                    getFormattedDate(formatForISO(event.endDate, event.endTime))
                  }}
                </span>
              </div>
              <div class="d-md-block d-sm-flex flex-row justify-center">
                <v-chip-group column>
                  <v-chip color="secondary" class="white--text">
                    {{ event.eventType }}
                  </v-chip>
                  <v-chip color="secondary" class="white--text">
                    <v-icon left color="primary"> mdi-map-marker </v-icon>
                    {{ event.location }}
                  </v-chip>
                  <v-chip
                    color="secondary"
                    v-for="(provider, index) in event.eventProviders"
                    :key="index"
                    class="white--text"
                  >
                    {{ provider.name }}
                  </v-chip>
                </v-chip-group>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div
              class="d-flex flex-row justify-center items-center"
              style="margin-top: 20%"
            >
              <v-btn
                @click="addDelegate(event)"
                color="primary"
                rounded
                class="text-capitalize"
              >
                <v-icon left>mdi-calendar</v-icon>
                book this site visit
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-card>
  </v-dialog>
</template>
<script>
import eventMixin from "../eventMixin";
export default {
  name: "SiteVisitEvents",
  components: {},
  mixins: [eventMixin],
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    events: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {};
  },

  computed: {
    childEventDetails() {
      return this.$store.getters["Events/childEvent"];
    },
    cpd_caption() {
      return process.env.VUE_APP_CPD_CAPTION;
    },
    settings() {
      return JSON.parse(window.localStorage.getItem("aquila_captions"));
    },
  },
  methods: {
    formatForISO(date, time) {
      return `${date}T${time}`;
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    addDelegate(relatedEvent) {
      if (relatedEvent) {
        this.$root.routeTo({
          name: "DelegateCard",
          params: {
            no: relatedEvent.no,
          },
        });
      }
    },
  },
};
</script>
<style>
@import url("../styles.css");
</style>
