import axios from "../axios-instance";
import spoonacular from "../spoonacular-instace";
import { mainError } from "../../services/alert";

export default {
  state: {
    mealPlans: null,
    savedMealPlans: null,
    paginationData:null
  },
  getters: {
    getPlans: (state) => state.mealPlans,
    getSavedPlans: (state) => state.savedMealPlans,
    getPagination:(state) =>state.paginationData
  },
  actions: {
    //COLLECT PLANS FROM API
    async collectPlansAPI({ commit }, data) {
      await spoonacular({
        method: "GET",
        url:
          "&targetCalories=" +
          data.cal +
          "&diet=" +
          data.diet +
          "&apiKey=fcc31449158b41ffa107596243839b6b",
      }).then((response) => {
        let data = JSON.parse(JSON.stringify(response.data));

        commit("updatePlans", data.week);
      });
    },
// ADD NEW PLAN DETAILS
    async addNewPlan({ commit }, data) {

      let nutri = data.obj.nutrients;
      let mealsAll = [];
      data.obj.meals.forEach((element) => {
        let obj = {
          readyInMinutes: element.readyInMinutes,
          servings: element.servings,
          sourceURL: element.sourceUrl,
          title: element.title,
          imageURL:
            "https://spoonacular.com/recipeImages/" +
            element.id +
            "-312x231." +
            element.imageType,
        };

        mealsAll.push(obj);
      });

      await axios({
        method: "post",
        url: "api/v1/mealplans",
        data: {
          calories: nutri.calories,
          carbohydrates: nutri.carbohydrates,
          fat: nutri.fat,
          protein: nutri.protein,
          title: data.title,
          meals: mealsAll,
        },
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },
// GET ALL MEAL PLANS
    async getMealPlans({ commit },data) {
      await axios({
        method: "get",
        url: `/api/v1/mealplans?limit=${data.limit}&page=${data.page}`
      })
        .then((response) => {
        
          commit("updateSavedPlans", response.data);
        })
        .catch((err) => {
       
          mainError(err);
        });
    },

    //UPDATE MEAL PLAN DETAILS 
    async updateMealPlan({ commit }, data) {
  
      await axios({
        method: "patch",
        url: `/api/v1/mealplans/${data.id}`,
        data: {
          title: data.title,
        }
      })
        .then((response) => {
       
        })
        .catch((err) => {
          mainError(err);
        });
    },
// DELETE MEAL PLAN
    async deleteMealPlan({ commit }, id) {
      await axios({
        method: "delete",
        url: `/api/v1/mealplans/${id}`
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },
    //SEARCH MEALPLANS SAVED
    async searchApi({ commit }, data) {
      await axios({
        method: "get",
        url: `/api/v1/mealplans?title=${data}`
      })
        .then((response) => {
        
          commit("updateSavedPlans", response.data);
        })
        .catch((err) => {
          mainError(err);
        });
    },
    //EMPTY STATE WHEN ROUTE IS LEFT 
    emptyState({ commit }) {
      let empty = null;
      commit("setEmptyRecepies", empty);
    },
  },
  mutations: {
    updatePlans: (state, plans) => (state.mealPlans = plans),
    updateSavedPlans: (state, savedplans) =>(state.savedMealPlans = savedplans),
    setEmptyRecepies: (state, data) => (state.mealPlans = data),
    displayPag : (state, data)=>(state.paginationData, data)

  },
};
