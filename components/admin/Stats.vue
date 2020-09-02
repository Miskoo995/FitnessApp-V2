<template>
  <div>
    <v-row class="mt-10">
      <v-col>
        <h3>Users per Gender</h3>
        <PerGender />
      </v-col>
      <v-col>
        <h3>Overall per Training</h3>

        <PerDone />
      </v-col>
    </v-row>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import store from "../../store/index";
import PerGender from "../admin/stats/PerGender";
import PerDone from "../admin/stats/PerDone";
export default {
  async beforeRouteEnter(to, from, next) {
    await Promise.all([
      store.dispatch("perGender"),
      store.dispatch("perDone"),
    ]).then(() => next());
  },

  components: {
    PerGender,
    PerDone,
  },

  data() {
    return {
      overlay: true,
    };
  },
  mounted() {
    setTimeout(() => {
      let vm = this;
      vm.overlay = false;
    }, 1000);
  },
};
</script>

<style></style>
