<template>
  <v-dialog v-model="setdialog" width="600" persistent>
    <v-card>
      <form id="detailForm">
        <div class="data-time">
          <fieldset>
            <legend>Select Arrival Date and Time</legend>
            <input
              v-model="arrivalDate"
              type="datetime-local"
              name="arrivalDateAndTime"
              id="cal"
              placeholder="Select Arrival Date and Time"
              required
              value=""
            />
          </fieldset>
        </div>
        <div class="actions">
          <v-btn @click="setdialog = false" class="text-red mr-6">
            Cancel
          </v-btn>
          <v-btn @click="setArrivalDetails" color="primary">
            set arrival date and time
          </v-btn>
        </div>
      </form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "DelegateArrival",
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  data() {
    return {
      arrivalDate: new Date(),
    };
  },
  computed: {
    setdialog: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("settingArrivalDialog", val);
      },
    },
  },
  methods: {
    setArrivalDetails() {
      const inputItem = document.getElementById("cal");
      if (inputItem.value.length < 1) {
        alert("Please add your arrival date and time!");
        return;
      }
      const arrivaldetails = new Date(this.arrivalDate).toISOString();
      this.$emit("setArrivalDetails", arrivaldetails);
      this.setdialog = false;
    },
  },
};
</script>
<style>
.data-time {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 8% 2%;
}
.data-time > fieldset {
  padding-left: 4%;
  border-radius: 10px;
  border: 1px solid #ccc;
  width: 90%;
}
.data-time > fieldset input {
  display: block;
  height: 4.5vh;
  width: 100%;
  border: none !important;
  outline: none !important;
}
.data-time > fieldset legend {
  font-size: 12px;
  font-weight: 600;
}
.actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 0 4% 8%;
}
</style>
