<template>
  <v-container>
    <v-container
      class=" mt-s4  mb-5 d-flex flex-row align-end justify-space-between "
    >
      <v-col cols="4" class="mt-12">
        <v-row>
          <h4>Search saved recepies</h4>
        </v-row>
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
      <v-col cols="4">
        <img width="200" :src="require('../../photos/diet2.svg')" alt="" />
      </v-col>
    </v-container>

    <v-row>
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="plans in displayMealPlans" :key="plans.id">
          <v-expansion-panel-header
            >{{ plans.title }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-template class="d-flex flex-row justify-space-around">
              <v-card-subtitle>
                Calories: {{ plans.calories }}
              </v-card-subtitle>
              <v-card-subtitle> Fat: {{ plans.fat }} </v-card-subtitle>
              <v-card-subtitle>
                Carbohydrates: {{ plans.carbohydrates }}
              </v-card-subtitle>
              <v-card-subtitle> Protein: {{ plans.protein }} </v-card-subtitle>
              <v-card-subtitle>
                <v-dialog v-model="dialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      depressed
                      class="ml-6"
                      v-on="on"
                      small
                      color="primary"
                      @click="preEditBind(plans.name)"
                    >
                      <v-icon>mdi-pencil</v-icon></v-btn
                    >
                  </template>
                  <v-form>
                    <v-card>
                      <v-card-title>
                        <span class="headline"
                          >Change Name Of Selected Plan</span
                        >
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row justify="center">
                            <v-col cols="8">
                              <v-text-field
                                type="text"
                                label="Change Name*"
                                v-model="nameChange"
                                required
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="dialog = false"
                          >Close</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="editName(plans.id)"
                          >Save</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
                <v-btn
                  depressed
                  class="ml-8"
                  small
                  color="error"
                  @click="deletePlan(plans.id)"
                >
                  <v-icon>mdi-delete</v-icon></v-btn
                >
              </v-card-subtitle>
            </v-template>
            <v-divider></v-divider>
            <v-row>
              <v-container
                class="d-flex flex-row"
                v-for="plan in plans.meals"
                :key="plan.id"
              >
                <v-col>
                  <img width="200" :src="plan.imageURL" />
                </v-col>
                <v-col>
                  <v-card-text>
                    {{ plan.title }}
                  </v-card-text>
                </v-col>
                <v-col>
                  <v-card-text>
                    Servings : {{ plan.servings }}
                    <v-icon> mdi-silverware</v-icon>
                  </v-card-text>
                </v-col>
                <v-col>
                  <v-card-text>
                    Ready for: {{ plan.readyInMinutes }} min
                    <v-icon>mdi-alarm</v-icon>
                  </v-card-text>
                </v-col>
                <v-col class="my-2">
                  <v-btn icon :href="plan.sourceURL" target="_blank"
                    ><v-icon>mdi-web</v-icon></v-btn
                  >
                </v-col>
              </v-container>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-divider></v-divider>
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
  </v-container>
</template>

<script>
import store from "../../store/index";
export default {
  async beforeRouteEnter(to, from, next) {
    await Promise.all([
      store.dispatch("getMealPlans", { limit: 5, page: 1}),
    ]).then(() => {
      next();
    });
  },
  data() {
    return {
      overlay: true,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      search: "",
      page: 1,
      limit: 5,
      
      getterSearch: "",
      nameChange: "",
      mealplans: null,
    };
  },
  computed: {
    displayMealPlans() {
      this.mealplans = this.$store.getters.getSavedPlans.data.mealPlans;
      let paginationData = this.$store.getters.getSavedPlans.totalResults;
      let paginationCalculate =  Math.ceil( paginationData / this.limit)

      console.log(paginationCalculate)

      this.pagTotal = paginationCalculate 

      console.log(paginationCalculate)
   
      return this.mealplans;
    },

    changingPagination() {
      this.$store.dispatch("getMealPlans", { limit: 5, page: this.page });
    },
  },

  watch: {
    page: function() {
      this.changingPagination();
    },
  },

  methods: {
    preEditBind(data) {
      this.nameChange = data;
    },
    searchOption() {
      if (this.search == "") {
        this.$store.dispatch("getMealPlans", { limit: 6, page: this.page });
      } else {
        this.$store.dispatch("searchApi", this.search).then(() => {
          this.displayMealPlans();
        });
      }
    },
    clearSearch(){
      this.search = ''
      this.$store.dispatch("getMealPlans", { limit: 6, page: this.page });
    },

    editName(data) {
      if (this.nameChange == "") {
        Toast.fire({
          icon: "error",
          title: "Enter new Meal Plan name!",
          position: "center",
        });
      } else {
        let obj = {
          id: data,
          title: this.nameChange,
        };
        this.$store.dispatch("updateMealPlan", obj).then(() => {
          this.$store.dispatch("getMealPlans", {
            limit: this.limit,
            page: this.page,
          });
        });
        Toast.fire({
          icon: "success",
          title: "Data is changed!",
          position: "center",
        });

        this.dialog = false;
      }
    },
    deletePlan(id) {
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            this.$store.dispatch("deleteMealPlan", id).then(() => {
              this.$store.dispatch("getMealPlans");
            });

            swalWithBootstrapButtons.fire(
              "Deleted!",
              "Your data has been deleted.",
              "success"
            );
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "We didnt delete it!",
              "error"
            );
          }
        });
    },
    
    
  },
  mounted() {
    setTimeout(() => {
      let vm = this;
      vm.overlay = false;
    }, 1000);
  },
};
</script>
