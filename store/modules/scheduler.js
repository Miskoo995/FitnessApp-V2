import { mainError } from "../../services/alert";
import axios from "../axios-instance";
export default {
  state: {
    trainings: null,
    historyTrainings: null,
    userTrainings: null,
  },
  getters: {
    getTrainingData: (state) => state.trainings,
    getHistoryData: (state) => state.historyTrainings,
  },
  actions: {
    //MAIN LOAD FOR TRAINING
    async loadTrainingData({ commit }) {
      let date = new Date();
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      await axios({
        method: "get",
        url: `/api/v1/trainings?date[gte]=${firstDay}&date[lte]=${lastDay}`,
      })
        .then((response) => {
          commit("updateTrainingData", response.data);
        })
        .catch((err) => {
          mainError(err);
        });
    },
    //MAIN LOAD FOR USER
    /* async loadTrainingUser({ commit }) {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let token = window.localStorage.getItem("token")
  
        await axios({
          method: "get",
          url: `/api/v1/trainings?date[gte]=${firstDay}&date[lte]=${lastDay}&user=${token}`,
        })
          .then((response) => {
           
            commit("updateTrainingUser", response.data);
          })
          .catch((err) => {
            mainError(err);
          }); 
      },*/
    //ADD NEW TRAINING
    async addNewTraining({ commit }, data) {
      await axios({
        method: "post",
        url: "api/v1/trainings",
        data: {
          color: data.color,
          user: data.user,
          mealPlan: data.meal_plan_id,
          date: data.date,
          exercises: data.excercises,
          intensity: data.intensity_id,
        },
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },
    //LOAD PAGINATION DATA
    async loadChangedRange({ commit }, data) {
      await axios({
        method: "get",
        url: `/api/v1/trainings?date[gte]=${data.firstDay}&date[lte]=${data.lastDay}`,
      })
        .then((response) => {
          commit("updateTrainingData", response.data);
        })
        .catch((err) => {
          mainError(err);
        });
    },
    // LOAD DATA WITH USER ID
    async loadChandedRangeWithUser({ commit }, data) {
      await axios({
        method: "get",
        url: `/api/v1/trainings?date[lte]=${data.lastDay}&date[gte]=${data.firstDay}&user=${data.id}`,
      })
        .then((response) => {
         
          commit("updateTrainingData", response.data);
        })
        .catch((err) => {
          mainError(err);
        });
    },
    //HISTORY - LOAD TRAININGS FROM USER
    async loadUserTrainings({ commit }, data) {
      await axios({
        method: "get",
        url: `/api/v1/trainings?limit=${data.limit}&page=${data.page}&user=${data.id}`,
      })
        .then((response) => {
          commit("updateHistoryData", response.data);
        })
        .catch((err) => {
          mainError(err);
        });
    },

    //UPDATE TRAINING DETAILS
    async updateTraining({ commit }, data) {
      await axios({
        method: "patch",
        url: `api/v1/trainings/${data.id}`,
        data: {
          color: data.color,
          user: data.user,
          mealPlan: data.meal_plan_id,
          date: data.date,
          exercises: data.excercises,
          intensity: data.intensity_id,
        },
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },
    //DELETE TRAINING
    async deleteTraining({ commit }, id) {
      await axios({
        method: "delete",
        url: `/api/v1/trainings/${id}`,
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },

    //MARK DONE TRAINING
    async markDone({ commit }, data) {
      await axios({
        method: "patch",
        url: `api/v1/trainings/${data.id}`,
        data: {
          isDone: data.isDone,
        },
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },
  },
  mutations: {
    updateTrainingData: (state, trainings) => (state.trainings = trainings),
    updateTrainingUser: (state, trainings) => (state.userTrainings = trainings),
    updateHistoryData: (state, trainings) =>(state.historyTrainings = trainings)
  },
};
