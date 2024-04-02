<template>
  <v-container fluid style="width: 90%">
    <v-row>
      <v-divider></v-divider>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          outlined
          v-model="term"
          placeholder="Search Events ..."
          dense
        >
          <template v-slot:append>
            <v-icon left>search</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-card flat class="mt-n5">
      <v-card-title class="">
        <span class="ml-n4">Active Events</span>
        <v-spacer />
        <v-btn-toggle
          color="primary"
          v-model="displayType"
          mandatory
          class="mr-4"
          borderless
          active-class="primary--text"
        >
          <v-tooltip bottom v-for="(item, i) in displayTypes" :key="i">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                v-on="on"
                v-bind="attrs"
                :value="item.value"
                :title="item.text"
              >
                {{ $vuetify.breakpoint.mdAndUp ? "" : item.text }}
                <v-icon>{{ item.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-card-title>

      <EventCards v-if="displayType === 'grid'" :events="events" />
      <EventList v-if="displayType === 'list'" :events="events" />
    </v-card>
  </v-container>
</template>
<script>
import eventMixin from "../eventMixin";
import EventCards from "./EventCards";
import EventList from "./EventList.vue";
import { eventListing } from "@/environment/environment";
export default {
  name: "Events",
  mixins: [eventMixin],
  components: {
    EventCards,
    EventList,
  },
  data: function () {
    return {
      term: "",
      selectedType: "",
      type: "week",
      focus: "",
      typeToLabel: {
        week: "Week",
        month: "Month",
        day: "Day",
        year: "year",
      },
      displayType: eventListing,
      displayTypes: [
        { text: "List", value: "list", icon: "format_list_bulleted" },
        { text: "Grid", value: "grid", icon: "grid_view" },
      ],
    };
  },

  beforeRouteEnter: function (to, from, next) {
    next((v) => {
      v.$store.dispatch("Events/getEvents");
    });
  },

  computed: {
    events() {
      return this.$store.getters["Events/events"];
    },
  },

  methods: {
    setToday: function () {
      this.focus = "";
    },

    calendarNavigate: function (direction) {
      Event.$emit("calender-navigate", direction);
    },

    images(number) {
      return require(`@/assets/images/picture${number}.jpg`);
    },
  },
};
</script>
<style>
@media (max-width: 768px) {
  #display1 {
    order: 2;
  }
  #display2 {
    order: 1;
  }
}
.cpd--chip {
  position: absolute !important;
  top: 10px !important;
  right: 10px !important;
}

.carousel--card {
  position: absolute;
  bottom: 0%;
  width: 75%;
  right: 0;
}
</style>
