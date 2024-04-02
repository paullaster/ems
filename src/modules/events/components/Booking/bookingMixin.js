export default {
  data() {
    return {};
  },
  computed: {
    countries() {
      return this.$store.getters["Events/countries"];
    },
    counties() {
      return this.$store.getters["Events/counties"];
    },
    disciplines() {
      return this.$store.getters["Events/disciplines"];
    },
    disciplineRequired() {
      return process.env.VUE_APP_DISCIPLINE_REQUIRED;
    },
    eventDelegate() {
      return this.$store.getters["Events/eventDelegate"];
    },
    event() {
      return this.$store.getters["Events/event"];
    },
    booking() {
      return this.$store.getters["Events/booking"];
    },
    displaySelectedAmount() {
      return this.$store.getters["Events/displaySelectedAmount"];
    },
    decryptedRoute() {
      return this.$root.decryptRoute(this.$route);
    },
  },
  methods: {
    filteredCounties(code){
      this.countiesList = this.counties.filter( function (county) {
          return code === county.countryCode;
      });
    },
    getCurrencies() {
      const currencies = [];
      if (this.event) {
        this.event.eventPackageCost.forEach((el) => {
          if (!currencies.includes(el.currencyCode))
            currencies.push(el.currencyCode);
        });
      }
      return currencies;
    },
    closeDialog: function () {
      if (this.$route.query.bookingNo || this.$route.params.bookingNo) {
        this.$router.back();
      } else {
        this.$router.replace({
          name: "booking",
          params: { no: this.$route.params.no },
        });
      }
    },
    maskString(string) {
      return string.replace(/.(?=.{4})/g, "*");
    },
  },
};
