<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined color="grey darken-2" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
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
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>

              <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="bindDataEdit(selectedEvent)"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>View Training</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn dark text @click="exportPdf(selectedEvent)"
                        >Save PDF<v-icon> mdi-file-pdf</v-icon></v-btn
                      >
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-container id="app">
                    <v-row justify="space-between">
                      <v-col>
                        <v-row clas>
                          <h6 class="mx-3">
                            <v-chip
                              class="m-1"
                              color="orange"
                              text-color="white"
                            >
                              {{ intesityName }}
                              <v-icon right>mdi-chart-line</v-icon>
                            </v-chip>
                          </h6>
                          <v-row>
                            <h6 class="mx-3 mt-4">Sets: {{ sets }}</h6>
                            <h6 class="mx-3 mt-4">Reps: {{ reps }}</h6>
                            <h6 class="mx-3 mt-4">Breaks: {{ breaks }} min</h6>
                          </v-row>
                        </v-row>
                      </v-col>
                      <v-col>
                        <v-container>
                          <v-chip class=" ml-3 mt-1" color="primary" label>
                            Date : <v-icon left>mdi-calendar</v-icon>
                            {{ dateTraining }}</v-chip
                          ></v-container
                        >
                      </v-col>
                    </v-row>
                    <v-row class="my-4">
                      <v-chip color="primary" class="mb-2"
                        >Exercises<v-icon>mdi-dumbbell</v-icon></v-chip
                      >
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">Name</th>
                              <th class="text-left">Group</th>
                              <th class="text-left">Description</th>
                              <th class="text-left">Link</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in excercises" :key="item.name">
                              <td>{{ item.title }}</td>
                              <td>
                                <v-chip
                                  class="m-2"
                                  color="primary"
                                  text-color="white"
                                >
                                  {{ item.group }}
                                  <v-icon right>mdi-label</v-icon>
                                </v-chip>
                              </td>
                              <td>{{ item.desc }}</td>
                              <td>
                                <v-btn
                                  icon
                                  :href="
                                    'https://www.youtube.com/watch?v=' +
                                      item.video
                                  "
                                  target="_blank"
                                  ><v-icon>mdi-web</v-icon></v-btn
                                >
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-row>
                    <v-row class="mt-12 ml-1">
                      <v-chip color="success" class="mb-8"
                        >Meal Plan <v-icon> mdi-food-variant</v-icon></v-chip
                      >
                      <h4 class="mx-3">{{ mealPlanName }}</h4>
                    </v-row>
                    <v-row>
                      <div v-for="plans in mealplans" :key="plans.id">
                        <v-card class="mx-4" max-width="312">
                          <img
                            :src="
                              'https://spoonacular.com/recipeImages/' +
                                plans.id +
                                '-312x231.' +
                                plans.imageType
                            "
                          />
                          <v-card-title>
                            {{ plans.title }}
                          </v-card-title>
                          <v-card-subtitle>
                            Website:
                            <v-btn icon :href="plans.sourceUrl" target="_blank">
                              <v-icon>mdi-web</v-icon></v-btn
                            >
                          </v-card-subtitle>
                        </v-card>
                      </div>
                    </v-row>
                  </v-container>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-card-text> </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>

import jsPDF from "jspdf";
import "jspdf-autotable";
import store from "../../store/index";

export default {
  async beforeRouteEnter(to, from, next) {
    await Promise.all([
        store.dispatch("loadTrainingUser")
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

    //Vuetify Calendar data
    excercises: [],
    mealplans: [],
    intesity: null,

    dialogEdit: false,
    dialog: false,
    notifications: false,
    sound: true,
    widgets: false,
    name: null,
    details: null,
    start: null,
    end: null,
    test: null,
    color: null,
    done: false,
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    breaks: null,
    sets: null,
    intesityName: null,
    reps: null,
    dateTraining: null,
    mealPlan1: null,
    mealPlan2: null,
    mealPlan3: null,
    mealPlanName: null,
  }),

  mounted() {
    this.collectTraings();
  },

  computed: {
    getName() {
      return User.getters("currentUserGetter");
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },

    userIdGetter() {
      return User.getters("getUserId");
    },
  },
  methods: {
    exportPdf(ev) {
   

      //Prepare data for pdf export

      let adjustedExerciseLinks = [];
      let adjustedMealPlans = [];
      let adjustedMealPlansLinks = [];

      this.excercises.forEach((exer, j) => {
        adjustedExerciseLinks.push({
          id: j + 1,
          name: exer.title,
          url: "https://www.youtube.com/watch?v=" + exer.video,
        });
      });

      this.mealplans.forEach((plan) => {
        adjustedMealPlans.push(plan.title);
        adjustedMealPlansLinks.push(plan.sourceUrl);
      });

      const doc = new jsPDF("l");
      
      // Add text header for intensity and date data 
      let textHeader =
       
        this.intesity.name +
        " - Reps :" +
        this.intesity.reps +
        " / Sets :" +
        this.intesity.sets +
        " / Breaks: " +
        this.intesity.break+' Min' +
        " / Date :" +
        ev.start;

      doc.setFontSize(18);
      doc.text(textHeader, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);


     // PDF sizes and parameters 
      var pageSize = doc.internal.pageSize;
      var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      var text = doc.splitTextToSize("Meals ", pageWidth - 35, {});
      doc.text(text, 14, 30);
      //First table for mealplans 

      doc.autoTable({
        head: [["First Meal", "Second Meal", "Third Meal"]],
        body: [adjustedMealPlans, adjustedMealPlansLinks],
        startY: 50,
        showHead: "firstPage",
      });

      doc.text("Exercises", 14, 90);

      //Second table for exercises 
      doc.autoTable({
        head: [],
        body: adjustedExerciseLinks,
        startY: 100,
        showHead: false,
        columnStyles: {
          id: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
        },
      });

      doc.save("table.pdf");
    },

    bindDataEdit(data) {
      let excerArray = [];

      let inte = Intensity.find(data.details.intensity_id);
      let mealp = MealPlans.find(data.details.meal_plan_id);

      data.details.excercises.forEach((el) => {
        excerArray.push(el);
      });

      let excer = Excercise.query()
        .whereIdIn(excerArray)
        .get();

      let intensityObj = {
        name: inte.name,
        reps: inte.reps,
        sets: inte.sets,
        break: inte.break,
      };

      this.mealPlan1 = mealp.meal1;
      this.mealPlan2 = mealp.meal2;
      this.mealPlan3 = mealp.meal3;
      this.mealPlanName = mealp.name;

      this.mealplans = [this.mealPlan1, this.mealPlan2, this.mealPlan3];
      this.excercises = excer;
      this.intesity = intensityObj;
      this.dateTraining = data.start;

      this.intesityName = inte.name;
      this.sets = inte.sets;
      this.breaks = inte.break;
      this.reps = inte.reps;
    },
    collectTraings() {
      let randomArray = [];
      let trainings = Training.all();

      let userId = this.userIdGetter;

      trainings.forEach((training) => {
        if (training.details.user_id == userId) {
          let updatedTraining = {
            id: training.id,
            name: this.getName[0].name + ` [${training.details.user_id}]`,
            color: training.color,
            start: training.start,
            end: training.end,
            details: training.details,
          };

          randomArray.push(updatedTraining);
        }
      });

      this.events = randomArray;
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
      const events = [];

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
