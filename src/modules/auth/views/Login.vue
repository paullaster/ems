<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card class="rounded-lg px-5">
        <v-card-title class="text-h5pt-0">
          <v-row no-gutters>
            <v-col cols="12" md="11" class="d-flex flex-column text-center">
              <v-avatar size="50" class="mx-auto">
                <v-img
                  contain
                  :src="`data:application/jpg;base64,${company.base64Logo}`"
                />
              </v-avatar>
              <span class="mt-1">Login</span>
            </v-col>
            <v-col cols="12" md="1">
              <v-btn
                icon
                flat
                color="accent"
                @click="$router.push({ name: 'EventList' })"
              >
                <v-icon color="black">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-6">
          <v-form>
            <v-text-field
              v-model="formData.email"
              label="Email"
              type="text"
              outlined
              dense
              :rules="rules.email"
              @keyup.enter="login()"
            />
            <v-text-field
              v-model="formData.password"
              label="Password"
              type="password"
              @copy.prevent
              outlined
              @keyup.enter="login()"
              :rules="rules.password"
              autocomplete="false"
              dense
            />
            <div class="d-flex">
              <v-checkbox label="Remember Me" hide-details class="me-3 mt-1">
              </v-checkbox>
              <v-spacer></v-spacer>
              <!-- forgot link -->
              <router-link
                :to="{ name: 'ForgotPassword' }"
                class="mt-1 text-decoration-none"
              >
                Forgot Password?
              </router-link>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="text-center d-flex flex-column">
          <v-spacer></v-spacer>
          <v-btn
            @click="login"
            :disabled="$store.getters['loading']"
            :loading="$store.getters['loading']"
            block
            @keyup.enter="login"
            color="primary"
          >
            Login
          </v-btn>
          <v-sheet height="80" class="py-6">
            Haven't signed up yet?
            <router-link
              :to="{ name: 'Signup', params: { no: $route.params.no } }"
              class="mt-1 text-decoration-none"
            >
              Sign up
            </router-link>
          </v-sheet>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AuthService from "@/modules/auth/AuthService";
export default {
  name: "Login",
  data: () => ({
    formData: {
      email: "",
      password: "",
    },
    dialog: true,
  }),
  mounted() {
    Event.$on("login-form", (state) => {
      this.dialog = state;
    });
    if (process.env.VUE_APP_ENABLE_LOGIN === "true" && AuthService.check()) {
      this.$router.replace({
        name: "booking",
        params: { no: this.$route.params.no },
      });
    }
  },

  computed: {
    company() {
      return this.$store.getters["Auth/company"];
    },
    rules() {
      return {
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+/.test(v) || "E-mail must be valid",
        ],
        password: [(v) => !!v || "Password is required"],
      };
    },
  },

  methods: {
    login: function () {
      this.$store.dispatch("Auth/login", this.formData);
    },
  },
};
</script>
<style scoped></style>
