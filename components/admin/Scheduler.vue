<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="info"
                class="mx-3"
                dark
                v-on="on"
                @click="loadDatainNew"
                >Add Training</v-btn
              >
            </template>
            <v-card>
              <v-toolbar dark color="primary">
                <v-toolbar-title>Add New Training</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-container>
                <v-row>
                  <v-row justify="space-around">
                    <v-col>
                      <!--  ne diraj-->
                      <v-subheader>Choose User</v-subheader>
                      <multiselect
                        v-model="selectedUser"
                        :options="availableUsers"
                        label="name"
                        track-by="name"
                      >
                      </multiselect>
                    </v-col>
                    <v-col>
                      <v-subheader>Choose Intensity </v-subheader>
                      <multiselect
                        v-model="selectedIntensity"
                        :options="availableIntesity"
                        label="name"
                        track-by="name"
                      >
                      </multiselect>
                    </v-col>
                    <v-col>
                      <v-subheader>Choose Meal Plan</v-subheader>
                      <multiselect
                        v-model="selectedMealPlan"
                        :options="availableMealPlans"
                        label="name"
                        track-by="name"
                      ></multiselect>
                    </v-col>
                    <v-col>
                      <v-subheader>Choose Excercises</v-subheader>
                      <multiselect
                        v-model="selectedExcercise"
                        :options="availableExcercises"
                        :multiple="true"
                        label="name"
                        track-by="name"
                      ></multiselect>
                    </v-col>
                  </v-row>
                  <v-row justify="space-between">
                    <v-col class="">
                      <v-subheader>Choose Date </v-subheader>

                      <v-date-picker
                        v-model="dateTraining"
                        full-width
                        :landscape="$vuetify.breakpoint.smAndUp"
                        class="mt-4"
                      ></v-date-picker>
                    </v-col>
                    <v-col class="ml-6">
                      <v-subheader>Choose Color </v-subheader>
                      <v-color-picker
                        v-model="color"
                        hide-inputs
                        hide-mode-switch
                        class="mt-4 "
                      >
                      </v-color-picker>
                    </v-col>
                  </v-row>
                </v-row>
                <hr />
                <v-row justify="end">
                  <v-col cols="2" class="mr-1">
                    <v-btn
                      color="info"
                      :loading="loading"
                      :disabled="loading"
                      @click="saveTrainingData"
                      >Save Training
                      <v-icon class="ml-2">mdi-content-save</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-dialog>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-col class="ml-10 mt-3" cols="5">
            <v-row>
              <v-col cols="6">
                <v-overflow-btn
                  class="my-2 mt-5"
                  :items="loadUsers"
                  label="Search by User: "
                  editable
                  :disabled="disabled"
                  v-model="searchUser"
                  @change="searchPerUser()"
                  item-value="id"
                ></v-overflow-btn>
              </v-col>
              <v-col class="mt-6">
                <v-btn color="info" @click="clearSearch">Reset</v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
         
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600" class="mt-4">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="400px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <div v-if="selectedEvent.done">
                <v-icon>mdi-checkbox-marked-circle</v-icon>
              </div>
              <div v-else>
                <v-icon>mdi-checkbox-blank-circle-outline</v-icon>
              </div>

              <v-toolbar-title
                v-html="selectedEvent.name"
                class="ml-5"
              ></v-toolbar-title>
              <v-spacer></v-spacer>

              <v-dialog
                v-model="dialogEdit"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="
                      loadDatainNew();
                      bindDataEdit(selectedEvent);
                    "
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialogEdit = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Edit Training</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn dark text @click="saveEditsData(selectedEvent)"
                        >Save Edits</v-btn
                      >
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-container>
                    <v-row justify="space-around">
                      <v-row>
                        <v-col
                          ><v-subheader>Choose User</v-subheader>
                          <multiselect
                            v-model="editSelectedUser"
                            :options="availableUsers"
                            label="name"
                            track-by="name"
                          ></multiselect>
                        </v-col>
                        <v-col>
                          <v-subheader>Choose Intensity </v-subheader>
                          <multiselect
                            v-model="editSelectedIntensity"
                            :options="availableIntesity"
                            label="name"
                            track-by="name"
                          ></multiselect>
                        </v-col>
                        <v-col>
                          <v-subheader>Choose Meal Plan</v-subheader>
                          <multiselect
                            v-model="editSelectedMealPlan"
                            :options="availableMealPlans"
                            label="name"
                            track-by="name"
                          ></multiselect>
                        </v-col>
                        <v-col>
                          <v-subheader>Choose Excercises</v-subheader>
                          <multiselect
                            v-model="editSelectedExcercise"
                            :options="availableExcercises"
                            :multiple="true"
                            label="name"
                            track-by="name"
                          ></multiselect>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-subheader class="mr-5">Choose Date </v-subheader>

                          <v-date-picker
                            v-model="date2"
                            full-width
                            :landscape="$vuetify.breakpoint.smAndUp"
                            class="mt-4"
                          ></v-date-picker>
                        </v-col>
                        <v-col class="mt-3 ml-6">
                          <v-subheader>Choose Color </v-subheader>
                          <v-color-picker
                            v-model="editColor"
                            hide-inputs
                            hide-mode-switch
                          ></v-color-picker>
                        </v-col>
                      </v-row>
                    </v-row>
                  </v-container>
                </v-card>
              </v-dialog>
              <v-btn @click="deleteTraining(selectedEvent)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <div>
                <v-list-item>
                  <v-list-item-content>
                    <div v-if="selectedEvent.done">
                      <v-col>
                        <v-row>
                          <h5 class="mr-5">Training is complete</h5>
                          <v-btn
                            color="primary"
                            @click="markDone(selectedEvent)"
                            small
                          >
                            change</v-btn
                          >
                        </v-row>
                      </v-col>
                    </div>
                    <div v-else>
                      <v-col>
                        <v-row>
                          <h5 class="mr-5">Training isn't complete</h5>
                          <v-btn
                            color="primary"
                            @click="markDone(selectedEvent)"
                            small
                            >change
                          </v-btn></v-row
                        >
                      </v-col>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<script>
import store from "../../store/index";
import exercises from "../../store/modules/exercises";
import intensity from "../../store/modules/intensity";
export default {
  async beforeRouteEnter(to, from, next) {
    await Promise.all([
      store.dispatch("loadTrainingData"),
      store.dispatch("getAllUsers", { limit: 0, page: 0 }),
      store.dispatch("getIntensity"),
      store.dispatch("getMealPlans", { limit: 0, page: 0 }),
      store.dispatch("collectExercise", { limit: 0, page: 0 }),
    ]).then(() => {
      next();
    });
  },

  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    typeToLabel: {
      month: "Month",

      week: "week",
      day: "Day",
      "4day": "4 Days",
    },
    //Models for Edit
    editSelectedId: null,
    editSelectedUser: null,
    editSelectedMealPlan: null,
    editSelectedExcercise: [],
    editSelectedIntensity: null,
    date2: "2020-06-14",
    editColor: null,
    editDone: false,
    //Models for new User Entry

    selectedUser: null,
    selectedMealPlan: null,
    selectedExcercise: [],
    selectedIntensity: null,
    availableIntesity: [],
    availableExcercises: [],
    availableUsers: [],
    availableMealPlans: [],

    dateTraining: null,

    //Vuetify Calendar data
    overlay: false,
    dialogEdit: false,
    dialog: false,
    notifications: false,
    sound: true,
    widgets: false,
    name: null,
    details: null,
    start: null,
    end: null,
    color: null,
    done: false,
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    dropdown_edit: [],
    loading: false,
    searchUser: null,
    firstDay: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    lastDay: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    upRangeEnd: null,
    upRangeStart: null,
  }),

  computed: {
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
    loadUsers() {
      let users = [];
      let get_users = store.getters.getAllUsers.data.users;
      get_users.forEach((user) => {
        let obj = {
          text: user.name,
          id: user.id,
        };
        this.dropdown_edit.push(obj);
      });
      return this.dropdown_edit;
    },
  },
  watch: {
    searchuser: function() {
      this.searchPerUser();
    },
  },
  methods: {
    //MARK TRAINING DONE
    markDone(data) {
      let doneUpdated = !data.details.done;
      let obj = {
        id: data.id,
        isDone: doneUpdated,
      };
      
      this.$store.dispatch("markDone", obj).then(() => {
       
          this.collectTrainings();
          this.selectedEvent.done = doneUpdated;
          this.selectedEvent.details.done = doneUpdated;

          this.selectedOpen = false;
      
      });
    },
    clearSearch() {

      this.searchUser = null;
      if (this.focus == this.today) {
        this.$store.dispatch("loadTrainingData").then(() => {
          this.collectTrainings();
        });
      } else {
        this.setToday();
        this.collectTrainings();
      }
    },
    deleteTraining(id) {
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            this.$store.dispatch("deleteTraining", id.id).then(() => {
              this.$store.dispatch("loadTrainingData").then(() => {
                this.collectTrainings();
                this.selectedOpen = false;
                swalWithBootstrapButtons.fire(
                  "Deleted!",
                  "Your Training has been deleted.",
                  "success"
                );
              });
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "We didnt delete it!",
              "error"
            );
          }
        });
    },
    searchPerUser() {
      let firstDay = this.firstDay.toISOString().substr(0, 10);
      let lastDay = this.lastDay.toISOString().substr(0, 10);

      this.$store
        .dispatch("loadChandedRangeWithUser", {
          firstDay: this.upRangeStart,
          lastDay: this.upRangeEnd,
          id: this.searchUser,
        })
        .then(() => {
          this.collectTrainings();

          // this.overlay = !this.overlay
        });
    },
    // SAVE NEW TRAINING IN DATABASE
    saveTrainingData() {
      if (
        this.selectedExcercise.length !== 0 &&
        this.dateTraining !== null &&
        this.selectedUser !== null &&
        this.selectedIntensity !== null &&
        this.selectedMealPlan !== null
      ) {
        this.loading = true;
        let excerciseId = [];
        this.selectedExcercise.forEach((excer) => {
          excerciseId.push(excer.id);
        });

        let obj = {
          color: this.color.hex,
          user: this.selectedUser.id,
          meal_plan_id: this.selectedMealPlan.id,
          date: this.dateTraining,
          excercises: excerciseId,
          intensity_id: this.selectedIntensity.id,
        };

        this.$store.dispatch("addNewTraining", obj).then(() => {
          store.dispatch("loadTrainingData").then(() => {
            this.collectTrainings();
            this.dialog = false;
            this.loading = false;
            this.selectedMealPlan = null;
            this.selectedIntensity = null;
            this.selectedExcercise = null;
            this.selectedUser = null;
          });
        });
      } else {
        Toast.fire({
          icon: "warning",
          title: "Please enter all data",
        });
      }
    },

    // BIND DATA IN FIELDS FOR EDIT
    bindDataEdit(eventData) {
      this.editSelectedId = eventData.id;

      this.editSelectedUser = {
        id: eventData.details.user_id,
        name: eventData.name,
      };
      this.editSelectedIntensity = {
        id: eventData.details.intensity_id,
        name: eventData.details.intensity_name,
      };
      this.editSelectedMealPlan = {
        id: eventData.details.mealplans_id,
        name: eventData.details.mealplans,
      };

      let ex = [];

      eventData.details.excercises.forEach((data) => {
        let obj = {
          id: data.id,
          name: data.name,
        };
        ex.push(obj);
      });
      this.editSelectedExcercise = ex;
      this.editColor = eventData.color;
      this.date2 = eventData.start;
      this.editDone = eventData.details.done;
    },

    //SAVE DATA ON ADD NEW TRAINING
    saveEditsData(eventData) {
      if (
        this.editSelectedExcercise.length !== 0 &&
        this.date2 !== null &&
        this.editSelectedUser !== null &&
        this.editSelectedIntensity !== null &&
        this.editSelectedMealPlan !== null
      ) {
        let excerciseId = [];
        this.editSelectedExcercise.forEach((excer) => {
          excerciseId.push(excer.id);
        });

        let obj = {
          id: this.editSelectedId,
          color: this.editColor,
          user: this.editSelectedUser.id,
          meal_plan_id: this.editSelectedMealPlan.id,
          date: this.date2,
          excercises: excerciseId,
          intensity_id: this.editSelectedIntensity.id,
        };

        this.selectedEvent.color = this.editColor;
        this.selectedEvent.details.excercises = this.editSelectedExcercise;
        this.selectedEvent.details.intensity_id = this.editSelectedIntensity.id;
        this.selectedEvent.details.intensity_name = this.editSelectedIntensity.name;
        this.selectedEvent.details.mealplans = this.editSelectedMealPlan.name;
        this.selectedEvent.details.mealplans_id = this.editSelectedMealPlan.id;
        this.selectedEvent.name = this.editSelectedUser.name;

        this.$store.dispatch("updateTraining", obj).then(() => {
          store.dispatch("loadTrainingData").then(() => {
            this.collectTrainings();
            this.dialogEdit = false;
            this.selectedOpen = false;
            Toast.fire({
              icon: "success",
              title: "Details are edited",
            });
          });
        });
      } else {
        Toast.fire({
          icon: "warning",
          title: "Please enter all data",
        });
      }
    },

    //LOAD DATA IN ON ADD NEW TRAINING - FIELD VALUES
    loadDatainNew() {
      let users = [];
      let excer = [];
      let meal_plan = [];
      let intensity = [];

      let get_users = store.getters.getAllUsers.data.users;

      let get_meal_plans = store.getters.getSavedPlans.data.mealPlans;

      let get_excer = store.getters.getTrainings.data.exercises;

      let get_intensity = store.getters.getIntensities;

      get_users.forEach((user) => {
        let obj = {
          name: user.name,
          id: user.id,
        };
        users.push(obj);
      });

      this.availableUsers = users;

      get_meal_plans.forEach((meal_plans) => {
        let obj = {
          name: meal_plans.title,
          id: meal_plans.id,
        };
        meal_plan.push(obj);
      });

      this.availableMealPlans = meal_plan;

      get_intensity.forEach((int) => {
        let obj = {
          name: int.name,
          id: int.id,
        };
        intensity.push(obj);
      });

      this.availableIntesity = intensity;

      get_excer.forEach((ex) => {
        let obj = {
          name: ex.title,
          id: ex.id,
        };
        excer.push(obj);
      });

      this.availableExcercises = excer;
    },

    // COLLECT ALL TRAINING DATA ON LOAD
    collectTrainings() {
      let trainingData = store.getters.getTrainingData.data.trainings;

      let updateArray = [];

      trainingData.forEach((data) => {
        let exArray = [];

        for (let i = 0; i < data.exercises.length; i++) {
          let obj = {
            id: data.exercises[i].id,
            name: data.exercises[i].title,
          };
          exArray.push(obj);
        }

        let obj = {
          id: data.id,
          name: data.user.name,
          color: data.color,
          start: new Date(data.date).toISOString().slice(0, 10),
          end: new Date(data.date).toISOString().slice(0, 10),
          done: data.isDone,
          details: {
            done: data.isDone,
            excercises: exArray,
            mealplans: data.mealPlan ? data.mealPlan.title : "",
            mealplans_id: data.mealPlan ? data.mealPlan.id : "",
            user_id: data.user ? data.user.id : "",
            intensity_id: data.intensity ? data.intensity.id : "",
            intensity_name: data.intensity ? data.intensity.name : "",
          },
        };

        updateArray.push(obj);
      });

      this.events = updateArray;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.upRangeStart = start.date;
      this.upRangeEnd = end.date;

      const events = [];

      if (this.searchUser != null) {
        this.$store
          .dispatch("loadChandedRangeWithUser", {
            firstDay: start.date,
            lastDay: end.date,
            id: this.searchUser,
          })
          .then(() => {
            this.collectTrainings();
          });
      } else {
        this.$store
          .dispatch("loadChangedRange", {
            firstDay: start.date,
            lastDay: end.date,
          })
          .then(() => {
            this.collectTrainings();
          });
      }

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);
      }
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    },
  },
};
</script>
<style>
.multiselect__tag {
  background-color: #1976d2;
}
.multiselect__tag-icon:after {
  color: #fff;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
