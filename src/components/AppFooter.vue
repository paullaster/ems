<template>
  <v-footer fixed padless :inset="true" color="#ffffff" elevation="12">
    <v-col class="text-start" md="2">
      <strong
        >{{ appName | capitalize }} © {{ new Date().getFullYear() }}</strong
      >
    </v-col>
    <v-col class="text-center text-truncate" style="color: #000000" md="8">
      <marquee
        behavior="scroll"
        direction="left"
        scrollamount="5"
        style="color: #000000"
      >
        <strong>{{ footerMessage }}</strong>
      </marquee>
    </v-col>
  </v-footer>
</template>
<script>
export default {
  name: "AppFooter",
  data: function () {
    return {
      appName: process.env.VUE_APP_NAME,
    };
  },
  computed: {
    footerMessage() {
      return process.env.VUE_APP_FOOTER_MESSAGE ?? "...";
    },
  },
};
</script>
