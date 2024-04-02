<template>
  <div class="my-5">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card rounded>
            <v-card-title>
              Receipt
              <v-spacer />
              <v-btn @click="download" outlined dark color="orange darken-3">
                <v-icon left>mdi-cloud-download</v-icon>
                Download
              </v-btn>
            </v-card-title>
            <v-divider />
            <pdf
              style="width: 100%"
              :src="`data:application/pdf;base64,${receipt}`"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import fileType from "file-type";
import pdf from "vue-pdf";
export default {
  name: "Receipt",
  components: { pdf },
  beforeRouteEnter(to, from, next) {
    next((v) => {
      v.$store.dispatch("Events/getReceipt", v.$route.params.receiptNo);
    });
  },
  computed: {
    receipt() {
      return this.$store.getters["Events/receipt"];
    },
  },
  methods: {
    download: async function () {
      const myBuffer = Buffer.from(this.receipt, "base64");
      await fileType.fromBuffer(myBuffer).then((res) => {
        const path = `data:${res.mime})};base64,${this.receipt}`;
        const element = document.createElement("a");
        element.setAttribute("href", path);
        element.setAttribute(
          "download",
          `${this.$root.decryptRoute(this.$route).params.receiptNo}.pdf`
        );
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      });
    },
  },
};
</script>

<style scoped></style>
