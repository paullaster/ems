<template>
  <v-row no-gutters class="pb-10">
    <v-col>
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="filteredEvents"
          :type="type"
          @click:event="openEvent"
          :start="today"
          :short-intervals="true"
          interval-height="100"
          interval-width="100"
          class="eventsCalender"
        >
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import eventMixin from "../eventMixin";
export default {
  name: "Calender",
  props: {
    typeToLabel: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    events: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [eventMixin],
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    selectedEvent: {},
    focus: "",
    selectedElement: null,
    selectedOpen: false,
    message: [],
    messageType: "",
  }),
  mounted() {
    this.$refs.calendar.checkChange();

    Event.$on("calender-navigate", (direction) => {
      if (direction === "") {
        this.focus = direction;
      } else {
        this.$refs.calendar[direction]();
      }
    });
  },
  computed: {
    isCalender: function () {
      return true;
    },

    filteredEvents() {
      let events = [];
      this.events.forEach((e) => {
        events.push({
          name: e.description,
          start: new Date(e.startDate),
          end: new Date(e.endDate),
          color: this.getColor(e.eventType),
          no: e.no,
        });
      });

      return events;
    },
  },
  methods: {
    openEvent: function (eventy) {
      this.$router.push({ name: "EventCard", params: { no: eventy.event.no } });
    },
  },
};
</script>
