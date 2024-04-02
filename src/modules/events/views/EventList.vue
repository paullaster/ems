<template>
  <div class="my-6 mb-10 pb-10">
    <!-- Event Card -->
    <v-card
      v-for="(event, i) in events.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      )"
      :key="i"
      @click="
        $root.routeTo({
          name: 'EventCard',
          params: { no: event.id },
        })
      "
      style="cursor: pointer"
      tile
      elevation="4"
      class="my-4"
    >
      <v-row no-gutters class="d-flex">
        <!-- Event Date -->
        <v-col cols="12" md="2">
          <v-card height="50%" tile color="secondary">
            <div class="text-center text-h5 py-3 white--text">
              {{ new Date(event.startDate).getDate() }}
              <sup class="text-uppercase">{{
                getOrdinalSuffix(new Date(event.startDate).getDate())
              }}</sup>
            </div>
          </v-card>
          <v-card height="50%" tile color="primary" class="text-center">
            <v-card-text>
              <span style="color: #fff" class="text-uppercase text-h5">{{
                months[new Date(event.startDate).getMonth()]
              }}</span>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Event Details -->
        <v-col cols="12" md="1">
          <div class="ml-3 mt-4 mr-n2">
            <badge v-if="event.cPDTerms" :cpd-caption="event.cPDTerms" />
            <CPDbadge v-else :cpd-points="event.cpdHours" />
          </div>
        </v-col>
        <v-col cols="12" md="7">
          <div class="mx- mt-5">
            <div class="dateText d-md-block d-sm-flex flex-row justify-center">
              <span class="font-weight-medium">{{ event.description }}</span>
              |
              <span class="mr-2 text-body-1"
                >From
                {{ getFormattedDate(formatForISO(event.startDate)) }}
                To
                {{ getFormattedDate(formatForISO(event.endDate)) }}
              </span>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="2" class="pa-3">
          <div
            class="d-flex flex-row justify-center items-center"
            style="margin-top: 20%"
          >
            <v-btn
              @click="
                $root.routeTo({
                  name: 'EventCard',
                  params: { no: event.id },
                })
              "
              color="primary"
            >
              <v-icon left>book_online</v-icon>
              Book here
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import eventMixin from "../eventMixin";
export default {
  name: "EventList",
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  mixins: [eventMixin],
  data() {
    return {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  computed: {
    cpd_caption() {
      return process.env.VUE_APP_CPD_CAPTION;
    },
    settings() {
      return JSON.parse(window.localStorage.getItem("aquila_captions"));
    },
  },
  methods: {
    formatForISO(date) {
      return `${date}`;
    },
  },
};
</script>
