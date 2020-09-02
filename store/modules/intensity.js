import axios from "../axios-instance";
import { mainError } from "../../services/alert";

export default {
  state: {
    intensities: null,
  },
  getters: {
    getIntensities: (state) => state.intensities,
  },
  actions: {

    //ADD NEW INTENSITY 
    async addIntensity({ commit }, data) {
      await axios({
        method: "post",
        url: "/api/v1/intensities",
        data: {
          name: data.name,
          color: data.color,
          repetitions: data.repetitions,
          sets: data.sets,
          break: data.break,
        },
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },
    //GET ALL INTENSITIES
    async getIntensity({ commit }) {
      await axios({
        method: "get",
        url: "api/v1/intensities",
      })
        .then((response) => {
          commit("intensityUpdate", response.data.data.intensityies);
        })
        .catch((err) => {
          mainError(err);
        });
    },
    //DELETE INTENSITY
    async deleteIntensity({ commit }, id) {
      await axios({
        method: "delete",
        url: `api/v1/intensities/${id}`,
      })
        .then((response) => {})
        .catch((err) => {
          mainError(err);
        });
    },
  },
  mutations: {
    intensityUpdate: (state, details) => (state.intensities = details),
  },
};
