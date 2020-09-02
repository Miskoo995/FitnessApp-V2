import Vue from "vue";
import store from "../store/index";
import auth from "../services/auth";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
//ADMIN ROUTES 
import Admin from "../components/Admin.vue";
import Scheduler from "../components/admin/Scheduler.vue";
import AdminWelcome from "../components/admin/WelcomeAdmin.vue";
import Intensity from "../components/admin/Intensity.vue";
import AddMealPlan from "../components/admin/AddMealPlan.vue";
import MealPlansView from "../components/admin/MealPlansView.vue";
import History from "../components/admin/History.vue";
import UsersPanel from "../components/admin/UsersPanel.vue";
import Stats from "../components/admin/Stats.vue";
import Exercises from "../components/admin/ExerciseAdmin.vue";

//USER ROUTES 
UserCalendar
import UserSettings from "../components/user/UserSettings.vue";
import UserWelcome from "../components/user/UserWelcome.vue";
import UserCalendar from "../components/user/UserCalendar.vue";

import User from "../components/User.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/login",
    component: Login,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      role: "user",
      middleware: [auth],
      requiresAuth: true,
    },
    children: [
      {
        path: "/",
        name: "AdminWelcome",
        component: AdminWelcome,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,  
        },
      },
      {
        path: "/admin/stats",
        name: "stats",
        component: Stats,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,  
        },
      },
      {
        path: 'history/:user_id',
        name: "history",  
        component: History,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,
        },
      },
      {
        path: "/admin/userspanel",
        name: "userspanel",  
        component: UsersPanel,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,
        },
      },
      {
        path: "/admin/scheduler",
        name: "Scheduler",
        component: Scheduler,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,
        },
      },
      {
        path: "/admin/intensity",
        name: "Intensity",
        component: Intensity,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,
        },
      },
      {
        path: "/admin/add-meal-plan",
        name: "AddMealPlan",
        component: AddMealPlan,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,
        },
      },
      {
        path: "/admin/meal-plans",
        name: "MealPlansView",
        component: MealPlansView,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,
        },
        
      },
      {
        path: "/admin/exercises",
        name: "exercises",
        component: Exercises,
        meta: {
          role: "admin",
          middleware: [auth],
          requiresAuth: true,
        },
        
      },
    ],
  },
  {
    path: "/user",
    name: "User",
    component: User,
    meta: {
      role: "user",
      middleware: [auth],
      requiresAuth: true,
    },
    children: [
      {
        path: "/user/settings",
        name: "UserSettings",
        component: UserSettings,
        meta: {
          role: "user",
          middleware: [auth],
          requiresAuth: true,
        },
      },
      {
        path: "/user/calendar",
        name: "UserCalendar",
        component: UserCalendar,
        meta: {
          role: "user",
          middleware: [auth],
          requiresAuth: true,
        },
      },
      {
        path: "/user",
        name: "UserWelcome",
        component: UserWelcome,
        meta: {
          role: "user",
          middleware: [auth],
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (window.localStorage.getItem("token") == null) {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      const localData = JSON.parse(window.localStorage.getItem("user")).role;

      const middleware = to.meta.middleware;

      const context = { to, from, next };

      //If there is no error from Auth, Unauthorized

      if (store.getters.errorDetails == null) {

        if(middleware && middleware.length > 0 ){
            
        middleware[0]({ ...context }).then(() => {

          if (localData == "user" && to.meta.role == "user") {

            if (to.meta.role == "admin") {
             return next("/user");
            }
            return next();
          } else if (localData == "admin" || to.meta.role == "admin") {
            if (to.meta.role == "user") {
              return next("/admin");
            } else {
              return next();
            }
          } else {
            return next();
          }
        });

        }

        return  next()
      }
    }
  } else {
    return next();
  }
});

export default router;
