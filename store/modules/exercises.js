import axios from "../axios-instance";
import router from "../../router/index";
import { mainError } from "../../services/alert";
export default {
  state: {
    allExercises: null,
  },
  getters: {
    getTrainings: (state) => state.allExercises,
  },
  actions: {
    //COLLECT EXERCISE DATA
    async collectExercise({ commit }, data) {
      await axios({
        method: "get",
        url: `/api/v1/exercises?limit=${data.limit}&page=${data.page}`,
      })
        .then((response) => {
        
          commit("updateExercises", response.data);
        })
        .catch((err) => {
        
          mainError(err);
        });
    },

    //ADD NEW EXERCISE DATA

    async addNewExercise({ commit }, data) {
      await axios({
        method: "post",
        url: "api/v1/exercises",
        data: {
          description: data.description,
          group: data.group,
          title: data.title,
          videoURL: data.videoURL,
        },
      })
        .then((response) => {
         
        })
        .catch((err) => {
          mainError(err);
        });
    },

    //SEARCH EXERCISE 

    async searchExercise({ commit }, data) {
      await axios({
        method: "get",
        url: `/api/v1/exercises?title=${data}`,
      })
        .then((response) => {
          
          commit("updateExercises", response.data);
        })
        .catch((err) => {
          mainError(err);
        });
    },

    //UPDATE EXERCISE DATA

    async updateExercise({ commit }, data) {
      await axios({
        method: "patch",
        url: `/api/v1/exercises/${data.id}`,
        data: {
          title: data.title,
          description: data.description,
          group: data.group,
          videoURL: data.videoURL,
        },
      })
        .then((response) => {
         
        })
        .catch((err) => {
          mainError(err);
        });
    },
    //DELETE EXERCISE FROM DATABASE
    async deleteExercise({ commit }, id) {
      await axios({
        method: "delete",
        url: `api/v1/exercises/${id}`,
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },
  },
  mutations: {
    updateExercises: (state, trainings) => (state.allExercises = trainings),
  },
};
