<template>
  <div>
    <v-row class=" d-flex flex-row align-center justify-space-around">
      <v-col cols="5">
        <img width="300" :src="require('../../photos/training.svg')" alt="" />
      </v-col>
      <v-col cols="3">
        <h6 class="ml-10">Search Users history</h6>
        <v-row>
          <v-text-field v-model="search"> </v-text-field>
          <v-row class="px-6">
            <v-btn color="info" class="mx-4" @click="searchOption" small>
              Search <v-icon>mdi-magnify</v-icon></v-btn
            >
            <v-btn color="primary" @click="clearSearch" small>
              RESET<v-icon>mdi-restart</v-icon></v-btn
            >
          </v-row>
        </v-row>
      </v-col>
    </v-row>

    <v-simple-table class="mt-5">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Email</th>
          <th class="text-left">Gender</th>
          <th class="text-left">History</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in displayUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.gender }}</td>
          <td>
            <router-link
              :to="{ name: 'history', params: { user_id: user.id } }"
            >
              <v-icon @click="collectData(user.id)">mdi-file</v-icon>
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <v-content>
      <v-container fluid>
        <router-view name="a" :key="$route.fullPath"></router-view>
      </v-container>
    </v-content>

    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="pagTotal"
        :total-visible="7"
      ></v-pagination>
    </div>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import store from "../../store/index";

export default {
  async beforeRouteEnter(to, from, next) {
    await Promise.all([
      store.dispatch("getAllUsers", { limit: 5, page: 1 }),
    ]).then(() => {
      next();
    });
  },

  data() {
    return {
      overlay: true,
      search: "",
      getterSearch: "",
      page: 1,
      limit: 5,
      pagTotal: 6,
      users: null,
    };
  },
  mounted() {
    setTimeout(() => {
      let vm = this;
      vm.overlay = false;
    }, 1000);
  },
  computed: {
    displayUsers() {
      this.users = this.$store.getters.getAllUsers.data.users;
      let paginationData = this.$store.getters.getAllUsers.totalResults;
       let paginationCalculate =  Math.ceil( paginationData / this.limit)
      this.pagTotal = paginationCalculate
     
      return this.users;
    },
  },
  watch: {
    page: function() {
      this.changingPagination();
    },
  },

  methods: {
    async collectData(id) {},
    changingPagination() {
      this.$store.dispatch("getAllUsers", { limit: 5, page: this.page });
    },

    searchOption() {
      if (this.search == "") {
        this.$store.dispatch("getAllUsers", { limit: 5, page: this.page });
      } else {
        this.$store.dispatch("searchUserHistory", this.search).then(() => {
          this.displayMealPlans();
        });
      }
    },

    clearSearch() {
      this.search = "";
      this.$store.dispatch("getAllUsers", { limit: 5, page: this.page });
    },
  },
};
</script>

<style></style>
