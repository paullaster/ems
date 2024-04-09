<template>
  <v-container fluid>
    <v-card class="py-6 px-6" width="50%">
      <v-card-title>
        <span class="headline">Create Admin User</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="FormData.name"
              label="Full Name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="FormData.username"
              label="username"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="FormData.password"
              label="password"
              required
              type="password"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            Already have an account?<v-btn
              color="blue"
              @click="$router.push({ name: 'Admin' })"
              text
              >login</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" @click="createAdmin"> Create admin </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "CreateAdmin",
  data() {
    return {
      FormData: {
        name: "",
        username: "",
        password: "",
      },
    };
  },
  methods: {
    createAdmin() {
      this.$store.dispatch("Admin/createAdmin", this.FormData);
    },
  },
};
</script>

<style lang="scss" scoped></style>
