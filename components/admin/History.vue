<template>
  <div>
    <v-template>
      <v-row class="d-flex flex-row  align-center justify-space-between">
        <v-col cols="4"> </v-col>
      </v-row>

      <span v-if="checker">
        <v-btn class="mt-8 " @click="goBack()" color="primary" icon><v-icon>mdi-arrow-left</v-icon>Back</v-btn>
        <v-expansion-panels class="mt-10">
          <v-expansion-panel v-for="detail in trainingData" :key="detail">
            <v-expansion-panel-header>
              <h3>
                <v-chip class="m-1" color="primary" text-color="white"
                  >{{ detail.user.name }} <v-icon right>mdi-contact</v-icon>
                </v-chip>
              </h3></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Date</th>
                      <th class="text-left">Meal Plan</th>
                      <th class="text-left">Intensity</th>
                      <th class="text-left">Exercises</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ detail.user.name }}</td>
                      <td>{{ detail.date.slice(0, 10) }}</td>
                      <td>{{ detail.mealPlan.title }}</td>
                      <td>{{ detail.intensity.name }}</td>
                      <td>
                        <span v-for="exer in detail.exercises" :key="exer.id">
                          <hr />
                          {{ exer.title }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="pagTotal"
            :total-visible="7"
          ></v-pagination>
        </div>
      </span>
      <span v-else>
        <v-row>
          <v-col cols="5" class="m-auto">
            <v-row class="ml-12">
              <h3 class="mr-4 mt-10">No Data Found...</h3>
              <v-btn class="mt-9 " @click="goBack()" color="primary" icon><v-icon>mdi-arrow-left</v-icon>Back</v-btn>
            </v-row>
            <img class="mt-5"
              width="350"
              :src="require('../../photos/not_found.svg')"
              alt=""
            />
          </v-col>
        </v-row>
      </span>
    </v-template>
  </div>
</template>

<script>
import store from "../../store/index";

export default {
  async beforeRouteEnter(to, from, next) {
    console.log();
    await Promise.all([
      store.dispatch("loadUserTrainings", {
        limit: 5,
        page: 1,
        id: to.params.user_id,
      }),
    ]).then(() => next());
  },

  data() {
    return {
      page: 1,
      perPage: 5,
      limit: 5,
      pagTotal: 6,
      trainingDetails: [],
      userName: "",
      checker: true,
    };
  },
  watch: {
    page: function() {
      this.changingPagination();
    },
  },

  computed: {
    trainingData() {
      let pagination = this.$store.getters.getHistoryData.returnedResults;
      this.pagTotal = pagination / this.limit + 1;

      console.log(this.$store.getters.getHistoryData.data.trainings);
      if (this.$store.getters.getHistoryData.data.trainings.length == 0) {
        this.checker = false;
      } else {
        this.checker = true;
      }
      return this.$store.getters.getHistoryData.data.trainings;
    },
  },
  methods: {
    goBack() {
      return this.$router.back();
    },
    changingPagination() {
      this.$store.dispatch("loadUserTrainings", {
        limit: 5,
        page: this.page,
        id: this.$route.params.user_id,
      });
    },
  },
};
</script>

<style></style>
