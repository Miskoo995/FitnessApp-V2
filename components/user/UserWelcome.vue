<template>
  <div>
    <v-row class=" mt-8">
      <v-col>
        <h1><strong> Welcome! </strong></h1>
        <h5>Main User Panel</h5>
      </v-col>
      <v-col>
        <img width="400" :src="require('../../photos/training2.svg')" alt="" />
      </v-col>
    </v-row>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
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
