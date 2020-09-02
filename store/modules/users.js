import axios from "../axios-instance";
import router from "../../router/index";
import { mainError } from "../../services/alert";

export default {
  state: {
    userDetails: null,
    errorData: null,
    globalError: null,
    allUsers:null
  },
  getters: {
    getUserDetails: (state) => state.userDetails,
    getAllUsers: (state) => state.allUsers,
    errorDetails: (state) => state.errorData,
    usersGlobalError: (state) => state.globalError,
  },
  actions: {
    //GET USER DETAILS FOR LOGGED IN.
    async getMe({ commit }) {
      await axios({
        method: "get",
        url: "/api/v1/auth/me",
      })
        .then((response) => {
          commit("userData", response.data.data.user);
        })
        .catch((err) => {
          mainError(err);
        });
    },
    // LOGIN MAIN
    loginMain({ commit }, data) {
      axios({
        method: "post",
        url: "/api/v1/auth/login",
        data: {
          email: data.email,
          password: data.password,
        },
      })
        .then((details) => {
          localStorage.setItem("token", details.data.data.token);
          localStorage.setItem("user", JSON.stringify(details.data.data.user));

          commit("userData", details.data.data.user);

          if (details.data.data.user.role == "admin") {
            router.push("/admin");
          } else {
            router.push("/user");
          }
        })
        .catch((err) => {
          mainError(err);
        });
    },

    //LOGOUT
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    },

    //REGISTRATION MAIN
    signUp({ commit }, data) {
      axios({
        method: "post",
        url: "/api/v1/auth/signup",
        data: {
          email: data.email,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          gender: data.gender,
          name: data.name,
        },
      })
        .then((response) => {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));

          router.push("/user");
        })
        .catch((err) => {
          mainError(err);
        });
    },

    //CHANGE PASSWORD ON USER
    changePassword({ commit }, data) {
      axios({
        method: "patch",
        url: "/api/v1/auth/updateMyPassword/",
        data: {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          passwordConfirm: data.passwordConfirm,
        },
      })
        .then((response) => {
          localStorage.setItem("token", response.data.data.token);
        })
        .catch((err) => {
          mainError(err);
        });
    },
    editUser({ commit }, data) {
      axios({
        method: "patch",
        url: "/api/v1/auth/updateMe/",
        data: data,
      })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          mainError(err);
        });
    },

    //DELETE USER

    async deleteUser() {
      await axios({
        method: "delete",
        url: "/api/v1/auth/deleteMe/",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.push("/");
    },
    //GET ALL USERS
    async getAllUsers({commit},data){

      await axios({
        method: "get",
        url: `/api/v1/users?limit=${data.limit}&page=${data.page}`,
      })
        .then((response) => {
          commit("usersData", response.data);
        })
        .catch((err) => {
         console.log(err)
        });
    },

    //SEARCH History 
    async searchUserHistory({ commit }, data) {
      await axios({
        method: "get",
        url: `/api/v1/users?name=${data}`
      })
        .then((response) => {
        
          commit("usersData", response.data);
        })
        .catch((err) => {
          mainError(err);
        });
    },
  
  },
  mutations: {
    userData: (state, userDetails) => (state.userDetails = userDetails),
    updateError: (state, errorData) => (state.errorData = errorData),
    usersData: (state, data) => (state.allUsers = data),
    globalUpdateError: (state, err) => (state.globalError = err),

  },
};
