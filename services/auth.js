import axios from "../store/axios-instance";
import store from "../store/index";

export default async function checkData({ next }) {
  await axios({
    method: "get",
    url: `/api/v1/auth/me?`,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      const localData = JSON.parse(window.localStorage.getItem("user")).role;

      if (response.data.data.user.role == localData) {
        return next();
      } else {
        return next("/login");
      }
    })
    .catch((err) => {
      console.log(err);

      store.dispatch("errorCatch", err);

      return next("/login");
    });
}
