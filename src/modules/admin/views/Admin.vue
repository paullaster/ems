<template>
  <v-container>
    <v-sheet>
      <v-toolbar dense elevation="0">
        <v-toolbar-title class="text-capitalize">
          Admin Settings
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-divider />
    </v-sheet>

    <v-card class="mt-5 px-13">
      <v-card-title class="text-subtitle-1">
        Event Captions <v-spacer />
      </v-card-title>
      <v-divider></v-divider>
      <!-- add key and value -->
      <v-card-text>
        <v-row>
          <v-col cols="12" md="5" class="d-flex justify-space-between">
            <v-text-field
              v-model="newKey"
              placeholder="New Key"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5" class="d-flex justify-space-between">
            <v-text-field
              v-model="newValue"
              placeholder="New Value"
              outlined
              dense
            ></v-text-field>
            <!-- <v-btn @click="addNewTextField">New</v-btn>
            <v-btn @click="saveChanges">Save All</v-btn> -->
          </v-col>
          <v-col cols="12" md="2" class="d-flex justify-end">
            <v-btn color="secondary" outlined @click="addNew">
              <v-icon class="mr-1">mdi-plus</v-icon> new
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text class="mt-4">
        <v-row>
          <template v-for="(data, key, i) in formData">
            <v-col cols="12" md="6" :key="i" class="mt-n7">
              <v-text-field
                :placeholder="formatKey(key)"
                outlined
                dense
                :label="formatKey(key)"
                :value="data"
                @input="updateValue(key, $event)"
              ></v-text-field>
            </v-col>
          </template>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveChanges">save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { helper } from "@/utils";
export default {
  name: "Admin",
  data() {
    return {
      formData: {},
      newKey: "",
      newValue: "",
    };
  },
  beforeRouteEnter: function (to, from, next) {
    next(() => {
      // v.$store.dispatch("Admin/getSettings");
    });
  },
  computed: {
    settings() {
      return this.$store.getters["Admin/adminGetters"]("settings");
    },
  },
  methods: {
    // format the key so that it is readable with space and uppercase
    formatKey(key) {
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    },
    // formatLabel(key, data) {
    //   return `${this.formatKey(key)}: ${data}`;
    // },
    addNew() {
      if (this.newKey && this.newValue) {
        this.$set(this.formData, this.newKey, this.newValue);
        this.newKey = "";
        this.newValue = "";
      }
    },
    updateValue(key, newValue) {
      this.formData[key] = newValue;
    },
    saveChanges() {
      const data = {
        captions: JSON.stringify(this.formData),
        id: this.settings ? this.settings.id : null,
      };
      if (this.settings.id) {
        console.log(data);
        this.$store.dispatch("Admin/updateSettings", {
          data: helper.prepareFormData(data),
          id: data.id,
        });
      } else {
        this.$store.dispatch(
          "Admin/storeSettings",
          helper.prepareFormData(data)
        );
      }
    },
  },
  watch: {
    settings() {
      const settings = this.settings ? JSON.parse(this.settings.captions) : {};
      this.formData = settings;
    },
  },
};
</script>

<style scoped></style>
