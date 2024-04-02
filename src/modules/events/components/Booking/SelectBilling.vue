<template>
  <div>
    <v-dialog v-model="selectDialog" width="50%" persistent>
      <v-card class="mx-auto">
        <v-card-title>Select Billing type</v-card-title>
        <v-card-text>
          <v-radio-group v-model="formData.billingType" row class="mt-n2 ml-n3">
            <v-col cols="12" md="6">
              <v-sheet
                outlined
                class="mx-2"
                :color="formData.billingType === 'individual' ? 'success' : ''"
                rounded
              >
                <v-card
                  @click="formData.billingType = 'individual'"
                  style="cursor: pointer"
                >
                  <v-card-text>
                    <v-radio value="individual" class="mb-2">
                      <template v-slot:label
                        ><span class="text-body-1 font-weight-bold"
                          >Individual
                        </span></template
                      >
                    </v-radio>
                    <div elevation="1">
                      <v-alert
                        text
                        type="info"
                        class="text-body-1 font-weight-bold"
                        dense
                        >Select individual if you are paying for
                        yourself</v-alert
                      >
                    </div>
                  </v-card-text>
                </v-card>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6" class="mb-2">
              <v-sheet
                outlined
                class="mx-2"
                :color="formData.billingType === 'corporate' ? 'success' : ''"
                rounded
              >
                <v-card
                  @click="formData.billingType = 'corporate'"
                  style="cursor: pointer"
                >
                  <v-card-text>
                    <v-radio value="corporate" class="mb-2">
                      <template v-slot:label
                        ><span class="text-body-1 font-weight-bold"
                          >Corporate
                        </span></template
                      >
                    </v-radio>
                    <div>
                      <v-alert
                        text
                        type="info"
                        class="text-body-1 font-weight-bold"
                        dense
                        >Select corporate if you are paying for someone
                        else</v-alert
                      >
                    </div>
                  </v-card-text>
                </v-card>
              </v-sheet>
            </v-col>
          </v-radio-group>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="corporateReferenceDialog" width="40%" persistent>
      <v-card class="mx-auto">
        <v-card-title>Enter Your Corporate Reference</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="formData.referenceNo"
            label="Corporate Reference"
            outlined
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            text
            class="text-capitalize"
            @click="cancelCorporate"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saceReferenceNo"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "SelectBilling",
  data() {
    return {
      selectDialog: true,
      corporateReferenceDialog: false,
      formData: {
        billingType: null,
        referenceNo: null,
      },
    };
  },
  computed: {
    billingCacheData() {
      return this.$store.getters["Events/billingCacheData"];
    },
  },
  methods: {
    cancelCorporate() {
      this.formData.billingType = null;
      this.corporateReferenceDialog = false;
    },
    saceReferenceNo() {
      this.$store.dispatch("Events/saveBillingCacheData", {
        billingType: this.formData.billingType,
        referenceNo: this.formData.referenceNo,
      });
      this.corporateReferenceDialog = false;
      this.selectDialog = false;
    },
  },
  watch: {
    dialog() {
      if (!this.selectDialog) {
        this.formData.billingType = null;
      }
    },
    "formData.billingType"() {
      if (this.formData.billingType === "corporate") {
        this.corporateReferenceDialog = true;
      } else {
        this.$store.dispatch("Events/saveBillingCacheData", {
          billingType: this.formData.billingType,
          referenceNo: null,
        });
        this.selectDialog = false;
      }
    },
  },
};
</script>
