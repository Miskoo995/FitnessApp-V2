<template>
  <v-container>
    <v-container class="d-flex flex-row mb-6 mr-5 justify-space-between">
      <v-col class="mr-6">
        <v-row>
          <v-col>
            <h1 class="">
              Search for Meal Plan <span class="mdi mdi-magnify"></span>
            </h1>
            <h6 class="my-5">
              Generate meal plans using the following parameters:
            </h6>
            <h6 class="mr-5">API Spoonacular</h6>
            <a href="https://spoonacular.com/food-api" target="”_blank”"
              ><img
                width="70"
                :src="require('../../photos/spoonacular.png')"
                alt=""
            /></a>
          </v-col>
          <v-col>
            <img width="350" :src="require('../../photos/diet.svg')" alt="" />
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-container class="d-flex flex-row">
          <v-col cols="4">
            <v-subheader>Choose Calories</v-subheader>
            <v-overflow-btn
              :items="availableCalories"
              type="number"
              min="1000"
              label="Enter Calories"
              item-value="text"
              v-model="choosenCal"
            ></v-overflow-btn>
          </v-col>
          <v-col cols="4">
            <v-subheader>Choose diet</v-subheader>
            <v-overflow-btn
              :items="availableDiets"
              label="Choose Diet"
              item-value="text"
              v-model="choosenDiet"
            ></v-overflow-btn>
          </v-col>

          <v-col cols="1" class="mt-3">
            <v-btn color="success" @click="searchApi" class="mt-12" dark large
              >Search Api</v-btn
            >
          </v-col>
        </v-container>
      </v-col>
    </v-container>

    <div v-for="(diet, i) in getPlans" :key="diet.id">
      <v-card class="my-3">
        <v-container>
          <v-row>
            <v-col cols="4">
              <h3 class="text-uppercase">{{ i }}</h3>
              <v-text-field
                label="Example: 2000 Cal. - Universal"
                type="text"
                v-model="planName"
              ></v-text-field>
            </v-col>
            <v-col class="mt-12">
              <v-row>
                <v-card-subtitle>
                  Calories:{{ diet.nutrients.calories }}
                </v-card-subtitle>
                <v-card-subtitle>
                  Carbohydrates:{{ diet.nutrients.carbohydrates }}
                </v-card-subtitle>
                <v-card-subtitle>
                  Fat:{{ diet.nutrients.fat }}
                </v-card-subtitle>
                <v-card-subtitle>
                  Protein:{{ diet.nutrients.protein }}
                </v-card-subtitle>
                <v-btn
                  class="mt-3"
                  @click="addNewPlan(diet, i)"
                  :disabled="isDisabled(i)"
                  small
                  color="success"
                  >Add Plan <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-container>

        <div
          v-for="data in diet.meals"
          :key="data.id"
          class="d-inline-flex d-row mb-5"
        >
          <v-card class="mx-2" width="330" max-height="430">
            <v-container>
              <v-card-title class=" d-block text-truncate">
                {{ data.title }}
              </v-card-title>

              <img
                width="200"
                :src="
                  'https://spoonacular.com/recipeImages/' +
                    data.id +
                    '-312x231.' +
                    data.imageType
                "
              />

              <v-card-title
                >Time:{{ data.readyInMinutes }} min <v-icon>mdi-alarm</v-icon>
              </v-card-title>

              <v-card-title
                >Servings: {{ data.servings }}
                <v-icon> mdi-silverware</v-icon></v-card-title
              >

              <v-card-title
                >Website:
                <v-btn icon :href="data.sourceUrl" target="_blank">
                  <v-icon>mdi-web</v-icon></v-btn
                ></v-card-title
              >
            </v-container>
          </v-card>
        </div>
      </v-card>
    </div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  /* beforeRouteEnter(to, from, next) {
    MealPlans.dispatch("collectMealPlanId").then(() => {
      next();
    });
  }, */

  data() {
    return {
      overlay: true,
      choosenCal: 2000,
      choosenDiet: "Paleo",
      availableCalories: [2000, 2500, 3000, 3500],
      availableDiets: [
        "Gluten Free",
        "Ketogenic",
        "Vegetarian",
        "Lacto-Vegetarian",
        "Ovo-Vegetarian",
        "Vegan",
        "Pescetarian",
        "Paleo",
        "Primal",
      ],
      isEditing: true,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      collectionId: null,
      planName: null,
      imageSource: null,
      disabledArray: [],
      plans: null,
    };
  },

  computed: {
    getPlans() {
      return this.$store.getters.getPlans;
    },
  },
  mounted() {
    setTimeout(() => {
      let vm = this;
      vm.overlay = false;
    }, 1000);
  },
  methods: {
    // Method for checking already added mealplans
    isDisabled(id) {
      let value = this.disabledArray.includes(id);
      if (value) {
        return true;
      } else {
        return false;
      }
    },
    // Add new Meal Plan
    addNewPlan(data, counter) {
      if (this.planName !== "") {
        Toast.fire({
          icon: "success",
          title: "New Meal Plan added",
          position: "center",
        });
        this.$store.dispatch("addNewPlan", {
          obj: data,
          title: this.planName,
        });

        this.disabledArray.push(counter);

        this.planName = "";
      } else {
        Toast.fire({
          icon: "error",
          title: "Enter Meal Plan name!",
          position: "center",
        });
      }
    },

    //Search API, using details Diet and Calories
    searchApi() {
      this.planName = ` ${this.choosenDiet}  /  ${this.choosenCal} calories`;

      this.$store.dispatch("collectPlansAPI", {
        cal: this.choosenCal,
        diet: this.choosenDiet,
      });
    },
  },
};
</script>

<style scoped></style>
