<template>
  <div>
    <v-row class=" mt-8">
      <v-col>
        <h1><strong> Welcome Admin</strong></h1>
        <h5>Main admin panel</h5>
      </v-col>
      <v-col>
        <img width="400" :src="require('../../photos/training3.svg')" alt="" />
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
