<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :to="item.link"
              link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" :to="item.link" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
      </v-toolbar-title>

      <v-spacer></v-spacer>
      Logout
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>

    <v-dialog v-model="dialog" width="800px"> </v-dialog>
  </v-app>
</template>
<script>
export default {
  //Before update, check for children component to save data in Add Meal Plan

  beforeRouteUpdate(to, from, next) {
    const getterState = this.$store.getters.getPlans;

    if (from.fullPath == "/admin/add-meal-plan") {
      if (getterState !== null) {
        swalWithBootstrapButtons
          .fire({
            title: "Saved all interesting plans?",
            text:
              " Unsaved plans will be lost, you won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, all saved!",
            cancelButtonText: "No, just a minute!",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.value) {
              this.$store.dispatch("emptyState");
              swalWithBootstrapButtons.fire(
                "All set!",
                "Your data is visible in Meal Plans.",
                "success"
              );
              next();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalWithBootstrapButtons.fire(
                "Cancelled",
                "No problem, take your time!",
                "success"
              );
            }
          });
      } else {
        next();
      }
    } else {
      next();
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout");
    },
  },
  props: {
    source: String,
  },
  data: () => ({
    dialog: false,
    drawer: null,
    items: [
      { icon: "mdi-home", text: "Home", link: "/admin" },
      { icon: "mdi-chart-pie", text: "Stats", link: "/admin/stats" },
      { icon: "mdi-contacts", text: "Users", link: "/admin/userspanel" },
      { icon: "mdi-calendar", text: "Scheduler", link: "/admin/scheduler" },
      {
        icon: "mdi-chart-areaspline",
        text: "Intensity",
        link: "/admin/intensity",
      },
      {
        icon: "mdi-nutrition",
        text: "Add New Meal Plan",
        link: "/admin/add-meal-plan",
      },
      { icon: "mdi-food", text: "Meal Plans", link: "/admin/meal-plans" },
      { icon: "mdi-dumbbell", text: "Excercises", link: "/admin/exercises" },
    ],
  }),
};
</script>
