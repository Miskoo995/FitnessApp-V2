<template>
  <div>
    <div id="chart">
      <apexchart
        type="donut"
        :options="chartOptions"
        v-model="genderCount"
        :series="series"
        width="400"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [],
      chartOptions: {
        labels: ["Male", "Female"],
      },
    };
  },

  computed: {
    genderCount() {
      this.series = this.$store.getters.getPerGender;
    },
  },
};
</script>

<style></style>
