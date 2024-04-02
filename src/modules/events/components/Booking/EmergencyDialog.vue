<template>
  <v-card flat class="mt-n3">
    <v-toolbar dense flat>
      <span class="headline ml-n4" v-if="!$vuetify.breakpoint.mobile">
        Emergency Contacts
        <v-chip small color="primary" outlined class="text-body-2">
          optional
        </v-chip>
      </span>
      <v-spacer />
      <v-dialog persistent v-model="dialog" width="60%">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            color="primary"
            :class="$vuetify.breakpoint.mobile ? '' : 'mr-n4'"
          >
            <v-icon class="mx-2">mdi-plus</v-icon>
            {{ $vuetify.breakpoint.mobile ? "" : "Add" }} Emergency Contact
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline"
            >{{ this.delegateEmergencyForm.isEdit ? "Edit" : "Add" }} Emergency
            Contact</v-card-title
          >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div>
                  Name
                  <span class="mx-2" style="color: red">*</span>
                </div>
                <v-text-field
                  ref="emergencyContactName"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateEmergencyForm.name"
                  placeholder="Emergency Contact Name"
                  outlined
                  dense
                  clearable
                  :rules="
                    isEmergencyRequired
                      ? delegateRules.emergencyContactName
                      : []
                  "
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >account_circle</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div>
                  Relation
                  <span class="mx-2" style="color: red">*</span>
                </div>
                <v-text-field
                  ref="emergencyContactRelation"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateEmergencyForm.relation"
                  placeholder="Emergency Contact Relation"
                  outlined
                  dense
                  clearable
                  :rules="
                    isEmergencyRequired
                      ? delegateRules.emergencyContactRelation
                      : []
                  "
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >account_circle</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div>
                  Phone Number
                  <span class="mx-2" style="color: red">*</span>
                </div>
                <v-text-field
                  type="tel"
                  ref="emergencyContactPhoneNo"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateEmergencyForm.phoneNo"
                  placeholder="emergency Contact PhoneNo"
                  outlined
                  dense
                  clearable
                  :rules="
                    isEmergencyRequired
                      ? delegateRules.emergencyContactPhoneNo
                      : []
                  "
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >phone</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div>
                  Emergency Email<span class="mx-2" style="color: red">*</span>
                </div>
                <v-text-field
                  ref="emergencyEmail"
                  :rules="delegateRules.emergencyEmail"
                  :disabled="delegateForm.delegateType === ''"
                  v-model="delegateEmergencyForm.eMail"
                  placeholder="Email"
                  outlined
                  dense
                  clearable
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" class="mt-1" size="30"
                      >email</v-icon
                    >
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="deep-orange" text @click="dialog = false">
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn color="primary" text @click="addEmergencyContact">
              {{ this.delegateEmergencyForm.isEdit ? "Edit" : "Add" }} Emergency
              Contact
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="delegateForm.delegateContact"
      :items-per-page="5"
      :hide-default-footer="delegateForm.delegateContact.length <= 5"
      class="elevation-0"
      dense
    >
      <template v-slot:item.actions="{ item, index }">
        <v-menu offset-y min-width="100">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" :attrs="attrs" icon>
              <v-icon size="25">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              dense
              v-for="(action, i) in actions"
              :key="i"
              :disabled="action.disabled"
              @click="action.action(item, index)"
            >
              <v-list-item-icon>
                <v-icon :color="action.iconColor" size="20">{{
                  action.icon
                }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ action.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  name: "EmergencyDialog",
  props: {
    event: {
      type: Object,
      required: true,
    },
    delegateForm: {
      type: Object,
      required: true,
    },
    emergencyContacts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialog: false,
      delegateEmergencyForm: {
        name: "",
        relation: "",
        phoneNo: "",
        eMail: "",
      },
    };
  },
  computed: {
    isEmergencyRequired() {
      return !this.event.isWebinar;
    },
    delegateRules() {
      return {
        emergencyContactName: [
          (v) => !!v || "Emergency Contact Name is required.",
        ],
        emergencyContactPhoneNo: [
          (v) => !!v || "Emergency Contact Phone Number is required.",
          (v) => /^\*?[^*]+\*?$/.test(v) || "Invalid phoneNo",
        ],
        emergencyContactRelation: [
          (v) => !!v || "Emergency Contact Relation is required.",
        ],
        emergencyEmail: [
          (value) => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (
              (pattern.test(value) && /^\*?[^*]+\*?$/.test(value)) ||
              "Invalid e-mail."
            );
          },
        ],
      };
    },
    headers() {
      return [
        { text: "Name", value: "name" },
        { text: "Relation", value: "relation" },
        { text: "Phone Number", value: "phoneNo" },
        { text: "Email", value: "eMail" },
        { text: "Actions", value: "actions", sortable: false },
      ];
    },
    actions: function () {
      return [
        {
          text: "Edit",
          icon: "mdi-pencil",
          iconColor: "indigo",
          action: (item, index) => {
            this.delegateEmergencyForm = item;
            this.delegateEmergencyForm.index = index;
            this.delegateEmergencyForm.isEdit = true;
            delete this.delegateEmergencyForm.versionNo;
            this.dialog = true;
          },
        },
        {
          text: "Remove",
          icon: "mdi-delete",
          iconColor: "deep-orange",
          action: (item, index) => {
            if (item.lineNo) {
              this.$confirm.show({
                title: "Delete Emergency Contact",
                text: "Are you sure you want to delete this Emergency Contact?",
                onConfirm: () => {
                  this.$store.dispatch("Events/deleteDelegateContact", item);
                },
              });
            } else {
              this.$emit("removeEmergencyContact", index);
            }
          },
        },
      ];
    },
  },
  methods: {
    addEmergencyContact() {
      let isValid = true;
      let invalidKey = "";
      for (const key in this.delegateRules) {
        isValid = isValid ? this.$refs[key].validate(true) : false;
        if (!isValid) {
          invalidKey = key.toUpperCase();
          break;
        }
      }
      if (isValid) {
        if (this.delegateEmergencyForm.isEdit) {
          this.$emit("editEmergencyContact", this.delegateEmergencyForm);
        } else {
          this.$emit("addEmergencyContact", this.delegateEmergencyForm);
        }
        this.dialog = false;
        this.resetForm();
      } else {
        Event.$emit("ApiError", `${invalidKey} is a required field`);
      }
    },
    resetForm() {
      this.delegateEmergencyForm = {
        name: "",
        relation: "",
        phoneNo: "",
        eMail: "",
        versionNo: 0,
      };
    },
  },
  watch: {
    emergencyContacts: {
      handler: function () {
        this.delegateForm.delegateContact.length = 0;
        this.emergencyContacts.map((item) => {
          const contact = {};
          contact.phoneNo = item["PhoneNo"];
          contact.eMail = item["Email"];
          contact.name = item["Name"];
          contact.versionNo = item["versionNo"];
          this.delegateForm.delegateContact.push(contact);
        });
      },
    },
  },
};
</script>
