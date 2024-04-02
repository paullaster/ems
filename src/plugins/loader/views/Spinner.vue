<template>
  <v-overlay color="#EBF5FB" v-if="$store.getters['loading']">
    <hollow-dots-spinner
      :animation-duration="2500"
      :size="65"
      color="#137f4e"
    />
  </v-overlay>
</template>

<script>
import { HollowDotsSpinner } from "epic-spinners";
export default {
  name: "Spinner",
  components: {
    HollowDotsSpinner,
  },
};
</script>

<style scoped></style>
