<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="590">
      <v-card>
        <v-card-title class="overline">
          {{ params.title }}
        </v-card-title>

        <v-card-text>
          {{ params.text }}
        </v-card-text>

        <v-card-text v-if="params.input">
          <v-textarea
            dense
            outlined
            v-model="input"
            :placeholder="params.label"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="deep-orange darken-1" text @click="cancel()">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirm()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "Confirmation",
  data: function () {
    return {
      dialog: false,
      params: {
        title: "",
        text: "",
        input: false,
        label: "",
        onConfirm: {},
        onCancel: {},
      },
      input: "",
      hasErrors: false,
    };
  },

  mounted() {
    Event.$on("show-confirmation", (params) => {
      this.show(params);
    });
  },

  methods: {
    show: function (params) {
      this.params = params;
      this.dialog = true;
    },

    hide: function () {
      this.dialog = false;
    },

    confirm: function () {
      if (typeof this.params.onConfirm === "function") {
        if (this.params.input === true && this.input === "") {
          this.hasErrors = true;
        } else {
          this.hasErrors = false;
          this.params.onConfirm(this.input);
          this.input = "";
          this.hide();
        }
      } else {
        this.hide();
        this.input = "";
      }
    },

    cancel: function () {
      if (typeof this.params.onCancel === "function") {
        this.params.onCancel();
        this.hide();
        this.input = "";
      } else {
        this.hide();
        this.input = "";
      }
    },
  },
};
</script>

<style scoped></style>
