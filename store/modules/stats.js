import axios from "../axios-instance";
import { mainError } from "../../services/alert";

export default {
  state: {
    perGender: null,
    perDone: null,
  },
  getters: {
    getPerGender: (state) => state.perGender,
    getPerDone: (state) => state.perDone,
  },
  actions: {
    //STATS PER GENDER
    async perGender({ commit }) {
      await axios({
        method: "get",
        url: `/api/v1/users`,
      })
        .then((response) => {
          let b = [];
          let prev;
          let data = [];
          response.data.data.users.forEach((details) => {
            if (details.gender != undefined) {
              data.push(details.gender);
            }
          });
          data.sort();
          data.forEach((el, key) => {
            if (data[key] !== prev) {
              b.push(1);
            } else {
              b[b.length - 1]++;
            }
            prev = data[key];
          });

          let female = Math.round((b[0] / data.length) * 100);
          let male = Math.round((b[1] / data.length) * 100);

          let obj = [male, female];
          commit("setGenderData", obj);
        })
        .catch((err) => {
          mainError(err);
        });
    },

    //STATS PER DONE
    async perDone({ commit }) {
      await axios({
        method: "get",
        url: `/api/v1/trainings`,
      })
        .then((response) => {
          let b = [];
          let prev;
          let data = [];

          response.data.data.trainings.forEach((details) => {
            data.push(details.isDone);
          });
          data.sort();
          data.forEach((el, key) => {
            if (data[key] !== prev) {
              b.push(1);
            } else {
              b[b.length - 1]++;
            }
            prev = data[key];
          });

          let done = Math.round((b[0] / data.length) * 100);
          let notDone = Math.round((b[1] / data.length) * 100);

          let obj = [done, notDone];
          commit("setPerDone", obj);
        })
        .catch((err) => {
          mainError(err);
        });
    },
  },
  mutations: {
    setGenderData: (state, data) => (state.perGender = data),
    setPerDone: (state, data) => (state.perDone = data),
  },
};
