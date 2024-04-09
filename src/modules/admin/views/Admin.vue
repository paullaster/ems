<template>
  <v-container>
    <v-card width="40%" class="py-6 px-6">
      <v-card-title>
        <span class="headline">Admin Login</span>
      </v-card-title>
      <v-card-text>
        <v-row flex>
          <v-col cols="12">
            <v-text-field
              v-model="FormData.username"
              label="Username"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="FormData.password"
              label="Password"
              type="password"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            create admin<v-btn
              @click="$router.push({ name: 'createAdmin' })"
              text
              color="blue"
              >here</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" @click="adminLogin"> Login </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { helper } from "@/utils";
export default {
  name: "Admin",
  data() {
    return {
      FormData: {
        username: "",
        password: "",
      },
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
    adminLogin() {
      this.$store.dispatch("Admin/login", this.FormData);
    }
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
