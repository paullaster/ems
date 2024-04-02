<template>
  <v-dialog v-model="setDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          color="primary darken-4"
          label
          small
          dense
          dark
          @click="download(document.download)"
          class="ml-3"
        >
          <v-icon>mdi-download-circle</v-icon>Download
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div v-if="show === true">
        <v-card-text
          v-if="document.documentFormat !== '.pdf'"
          class="overflow-y-auto overflow-x-hidden mt-3"
          style="max-height: 70vh"
        >
          <v-img class="pa-9" :src="url + document.base64Document" />
        </v-card-text>

        <v-card-text
          v-if="document.documentFormat === '.pdf'"
          class="overflow-y-auto overflow-x-hidden mt-3"
          style="max-height: 70vh"
        >
          <v-card-text
            class="elevation-2 mb-2"
            v-for="i in document.pages"
            :key="i"
          >
            <pdf
              style="width: 100%"
              :src="url + document.base64Document"
              :page="i"
            />
          </v-card-text>
        </v-card-text>
      </div>

      <v-card-text
        v-else
        class="overflow-y-auto overflow-x-hidden mt-3"
        style="max-height: 70vh"
      >
        <v-skeleton-loader type="image" />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          dark
          depressed
          color="error"
          plain
          @click="(setDialog = false), (show = false)"
        >
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import eventMixin from "../eventMixin";
import pdf from "vue-pdf";

export default {
  name: "PreviewDialog",
  components: { pdf },
  mixins: [eventMixin],
  props: { dialog: Boolean, document: { default: null, type: Object } },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    setDialog: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("close-dialog", val);
      },
    },
  },
  watch: {
    document: {
      handler: function (n) {
        if (n.length !== 0) {
          setTimeout(() => {
            this.show = true;
          }, 1000);
        }
        console.log(this.document.fileName, this.document.description);
      },
    },
  },
};
</script>
