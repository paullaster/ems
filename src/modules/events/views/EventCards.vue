<template>
  <v-card
    flat
    :class="`mb-10 pb-10 ${
      $vuetify.breakpoint.sm || $vuetify.breakpoint.xs ? 'mx-1' : ''
    }`"
  >
    <div class="d-flex justify-start flex-wrap">
      <v-card
        v-for="event in events"
        :key="event.id"
        :class="`${
          $vuetify.breakpoint.mdAndUp ? 'mx-2' : ''
        } my-2 card--margins`"
        :width="$vuetify.breakpoint.mdAndUp ? '265' : '100%'"
      >
        <div>
          <v-img
            :src="url + event?.image"
            :lazy-src="require(`@/assets/images/picture4.jpg`)"
            height="175"
            :width="$vuetify.breakpoint.mdAndUp ? '265' : '100%'"
            class="card--margins"
            @click="
              $root.routeTo({
                name: 'EventCard',
                params: { no: event.id },
              })
            "
          />
          <span class="cpd--chip">
            <!-- <v-chip
              label
              color="orange accent-4 font-weight-bold text-lg-h5"
              dark
            >
              <v-icon class="mx-2">stars</v-icon> {{ event.cpdHours }} CPD Hours
            </v-chip> -->
            <v-chip color="red darken-1" dark v-if="isWebinar(event)">
              webinar
            </v-chip>
          </span>
        </div>

        <div
          @click="
            $root.routeTo({
              name: 'EventCard',
              params: { no: event.id },
            })
          "
          class="text-capitalize mt-2 mx-2 text-body-2 text-truncate font-weight-bold"
        >
          <span class="pointer">{{ event.description }}</span>
        </div>

        <div class="text-wrap mx-2 text-truncate">
          <span>
            {{ days[new Date(event.startDate).getDay()] }},
            {{ months[new Date(event.startDate).getMonth()] }}
            {{ new Date(event.startDate).getDate() }},
            {{ new Date(event.startDate).getFullYear() }}
          </span>
          <v-icon small>mdi-map-marker</v-icon>
          {{ event.venu }}
        </div>

        <v-btn
          block
          class="text-capitalize mt-1 book--btn text-body-2"
          @click="
            $root.routeTo({
              name: 'booking',
              params: { no: event.id },
            })
          "
          color="primary"
        >
          Book here
          <v-icon class="mx-2">mdi-bookmark-plus</v-icon>
        </v-btn>
      </v-card>
    </div>
  </v-card>
</template>
<script>
import eventMixin from "../eventMixin";
export default {
  name: "EventCards",
  mixins: [eventMixin],
  props: {
    events: {
      type: Array,
      default: () => [],
    },
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
    isWebinar(event) {
      return event.isWebinar;
    },
  },
};
</script>
<style>
.card--margins {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
}

.book--btn.v-btn {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
</style>
