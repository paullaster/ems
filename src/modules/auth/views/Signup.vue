<template>
  <v-dialog
    v-model="dialog"
    width="60%"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    persistent
  >
    <v-card flat class="rounded-lg" max-width="100%">
      <v-card-title
        class="text-center d-flex"
        :class="$vuetify.breakpoint.smAndDown ? '' : 'mx-10 '"
      >
        <v-row no-gutters>
          <v-col cols="11">
            <p class="px-4">ACCOUNT CREATION</p>
          </v-col>

          <v-col cols="1" class="d-flex align-center">
            <v-btn icon color="error" class="mt-n4" @click="$router.push({name: 'EventList'})">
              <v-icon color="error">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>

      <v-row no-gutters>
        <v-col cols="12" md="7">
          <v-card-text class="d-flex flex-column justify-center">
            <div
              class="text-center"
              :class="$vuetify.breakpoint.smAndDown ? '' : 'mx-10 '"
            >
              <v-form class="mt-2" ref="SignupForm" v-model="isValid">
                <v-row>
                  <!-- first_name -->
                  <v-col cols="12" md="6" sm="12">
                    <v-text-field
                      label="First Name"
                      placeholder="Enter your First Name"
                      v-model="formData.first_name"
                      :rules="rules.required"
                      outlined
                      dense
                      required
                    />
                  </v-col>
                  <!-- last_name -->
                  <v-col
                    cols="12"
                    md="6"
                    sm="12"
                    :class="$vuetify.breakpoint.smAndDown ? 'mt-n4' : ''"
                  >
                    <v-text-field
                      label="Last Name"
                      placeholder="Enter your Last Name"
                      v-model="formData.last_name"
                      :rules="rules.required"
                      outlined
                      dense
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="12" sm="12" class="mt-n7">
                    <vue-tel-input-vuetify
                      required
                      outlined
                      default-country="KE"
                      label="Phone Number"
                      dense
                      mode="international"
                      success="success"
                      hint="Select country code to proceed"
                      v-model="formData.phone_no"
                      :rules="rules.phone"
                    ></vue-tel-input-vuetify>
                  </v-col>
                  <!-- email -->
                  <v-col cols="12" md="12" sm="12" class="mt-n7">
                    <v-text-field
                      label="Email"
                      placeholder="Email"
                      v-model="formData.email"
                      :rules="rules.email"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- id -->
                  <v-col cols="12" md="12" sm="12" class="mt-n7">
                    <v-text-field
                      label="ID/ Passport No."
                      placeholder="Enter National ID / Passport  No"
                      v-model="formData.id_number"
                      :rules="rules.id_number"
                      dense
                      outlined
                    ></v-text-field>
                  </v-col>
                  <!-- password -->
                  <v-col cols="12" md="12" sm="12" class="mt-n7">
                    <v-text-field
                      label="Password"
                      placeholder="Enter Password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="off"
                      id="password"
                      v-model="formData.password"
                      :rules="rules.pwdRules"
                      outlined
                      dense
                      required
                      @copy.prevent
                      @paste.prevent
                    >
                      <template v-slot:append>
                        <v-btn @click="showPassword = !showPassword" icon>
                          <v-icon size="20">{{
                            showPassword ? "visibility" : "visibility_off"
                          }}</v-icon>
                        </v-btn>
                      </template>
                      <!-- <template v-slot:message="{}">
                        <ul class="my-1">
                          <li
                            v-bind:class="{
                              is_valid: contains_eight_characters,
                            }"
                          >
                            At least 8 Characters long
                          </li>
                          <li
                            v-bind:class="{
                              is_valid: contains_max_sixteen_characters,
                            }"
                          >
                            Password should not be longer than 16 characters
                          </li>
                          <li v-bind:class="{ is_valid: contains_number }">
                            Contains Number
                          </li>
                          <li v-bind:class="{ is_valid: contains_uppercase }">
                            Contains Uppercase
                          </li>
                          <li v-bind:class="{ is_valid: contains_lowercase }">
                            Contains Lowercase
                          </li>
                          <li
                            v-bind:class="{
                              is_valid: contains_special_character,
                            }"
                          >
                            Contains Special Character
                          </li>
                        </ul>
                      </template> -->
                    </v-text-field>
                  </v-col>
                  <!-- confirm password -->
                  <v-col cols="12" md="12" sm="12" class="mt-n7">
                    <v-text-field
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      :type="showPassword ? 'text' : 'password'"
                      id="confirmPassword"
                      v-model="formData.confirmPassword"
                      :rules="rules.pwdConfirm"
                      outlined
                      dense
                      @copy.prevent
                      @paste.prevent
                      required
                    >
                      <template v-slot:append>
                        <v-btn @click="showPassword = !showPassword" icon>
                          <v-icon size="20">{{
                            showPassword ? "visibility" : "visibility_off"
                          }}</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-card-text>
        </v-col>
        <v-col cols="12" md="5" class="ma-auto">
          <v-avatar size="345">
            <v-img
              contain
              :src="`data:application/jpg;base64,${company.base64Logo}`"
            />
          </v-avatar>
        </v-col>
        <v-col cols="12">
          <v-divider />

          <v-card-actions>
            <v-btn class="primary mx-auto" @click="Signup">Sign Up</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>

    <Spinner />
  </v-dialog>
</template>
<script>
import Spinner from "@/plugins/loader/views/Spinner";
import AuthService from "@/modules/auth/AuthService";
export default {
  name: "Signup",
  components: { Spinner },
  data() {
    return {
      showPassword: false,
      isValid: false,
      formData: {
        email: "",
        first_name: "",
        last_name: "",
        id_number: "",
        password: "",
        confirmPassword: "",
        phone_no: "",
      },
      dialog: true,
    };
  },
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
    rules() {
      return {
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+/.test(v) || "E-mail must be valid",
        ],
        phone: [
          (v) => !!v || "Phone Number is required",
          (v) =>
            /^\+(?:[0-9] ?){6,14}[0-9]$/.test(v) ||
            "Provide valid phone number",
        ],
        id_number: [
          (v) => !!v || "ID Number is required",
          (v) => /^[0-9]*$/.test(v) || "Please enter a valid ID/ passport No",
        ],
        pwdRules: [
          (v) => !!v || "Password required",
          (v) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#~^()`.,;:{}_/%*?&])[A-Za-z\d@$!#~^()`.,;:{}_/%*?&]{8,16}$/.test(
              v
            ) ||
            "Password should contain: Minimum 8 and maximum 16 characters, at least one uppercase letter, one lowercase letter, one number and at least one special character(@$!#~^()`.,;:{}_/%*?&)",
        ],
        pwdConfirm: [
          (v) => !!v || "Confirm password required",
          (v) => v === this.formData.password || "Passwords do not match",
        ],
        required: [(v) => !!v || "Field is required"],
      };
    },
    company() {
      return this.$store.getters["Auth/company"];
    },
  },
  methods: {
    Signup() {
      if (!this.isValid) {
        this.$refs.SignupForm.validate();
      } else if (this.formData.password !== this.formData.confirmPassword) {
        Event.$emit("Invalid", "Passwords don't match");
      } else {
        this.$store.dispatch("Auth/register", { ...this.formData });
      }
    },
  },
};
</script>
<style scoped>
@media (max-width: 768px) {
  #flex {
    display: flex;
    flex-direction: column;
  }
  #display1 {
    order: 2;
  }
  #display2 {
    order: 1;
  }
}
.font {
  color: rgba(240, 248, 255, 0.903);
  font-size: 16px !important;
}
.v-input__slot::before {
  border-style: none !important;
}
</style>
