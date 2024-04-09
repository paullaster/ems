<template>
  <v-container fluid>
    <v-card elevation="0" class="py-6 px-6">
      <v-card-title>
        <span class="heading"></span>
      </v-card-title>
      <v-card-tex elevation="0" class="py-6 px-6">
        <v-form>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="FormData.title"
                label="Title"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="FormData.description"
                label="Event description"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="FormData.cost"
                label="Event cost"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="FormData.venue"
                label="venue"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="FormData.startDate"
                label="Start date"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="FormData.endDate"
                label="End date"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-file-input
                v-model="files"
                @change="getFileUpload"
                chips
                label="Upload event thumbnail"
              ></v-file-input>
            </v-col>
            <v-col cols="6">
              <v-btn color="primary" @click="createEvent">
                <v-icon>mdi-plus</v-icon>
                Add Event
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-tex>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: "CreateEventComponent",
  data() {
    return {
      FormData: {
        title: "",
        description: "",
        cost: 0,
        venue: "",
        startDate: "",
        endDate: "",
        image: "",
    },
    files: "",
    };
  },
  methods: {
    getFileUpload(){
        const reader = new FileReader();
      reader.onload = () => {
        console.log("Window loaded");
        this.FormData.image = reader.result.split(",")[1];
      };
      reader.readAsDataURL(this.files);
    },
    createEvent() {
      this.FormData.startDate = this.formatdate(this.FormData.startDate);
      this.FormData.endDate = this.formatdate(this.FormData.endDate);
      this.$store.dispatch("Events/createEvent", this.FormData);
    },
    formatdate(date) {
      let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
  },
};
</script>
<style scoped></style>
