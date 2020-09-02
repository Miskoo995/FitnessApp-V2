<template>
  <div>
    <v-row>
      <v-col class="mb-4">
        <img width="350" :src="require('../../photos/training4.svg')" alt="" />
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <h2>Exercises overview</h2>
            <h6>Save new exercises in database</h6>
          </v-col>

          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn class="mt-8 mr-12" v-on="on" color="primary">
                Add new
              </v-btn>
            </template>
            <v-form>
              <v-card>
                <v-card-title>
                  <span class="headline">Add New exercise</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Name*"
                          v-model="exerciseTitle"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          :items="groups"
                          v-model="exerciseGroup"
                          label="Choose group"
                        ></v-select>
                      </v-col>

                      <v-col cols="12">
                        <v-text-field
                          label="Link*"
                          v-model="exerciseVideo"
                          hint="Enter YouTube Link here"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-textarea
                        v-model="exerciseDesc"
                        solo
                        name="input-7-4"
                        label="Add description"
                      ></v-textarea>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false"
                    >Close</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="addExerciseData"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-row>
        <v-row>
          <v-col class="ml-2" cols="6">
              <v-row>
          <v-text-field v-model="search"> </v-text-field>
          <v-row class="px-6">
            <v-btn color="info" class="mx-4" @click="searchOption" small>
              Search <v-icon>mdi-magnify</v-icon></v-btn
            >
            <v-btn color="primary" @click="clearSearch" small>
              RESET<v-icon>mdi-restart</v-icon></v-btn
            >
          </v-row>
        </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-container class="ml-4" :align="right"> </v-container>

    <v-container>
      <v-row class="mt-12" justify="space-around" no-gutters>
        <div v-for="exercise in getExercises" :key="exercise.id">
          <v-card max-width="344" class="mx-auto my-3">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline">{{
                  exercise.title
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip class="ma-2" color="primary" label text-color="white">
                    <v-icon left>mdi-label</v-icon>
                    {{ exercise.group }}
                  </v-chip></v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <youtube-media
              player-width="344"
              :video-id="exercise.videoURL"
            ></youtube-media>

            <v-card-text class=" d-block">
              {{ exercise.description }}
            </v-card-text>

            <v-card-actions>
              <v-btn
                @click="preEditBind(exercise)"
                text
                color="primary accent-4"
              >
                Edit
              </v-btn>

              <v-btn
                @click="deleteExercise(exercise.id)"
                text
                color="primary accent-4"
              >
                Delete
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </div>
      </v-row>

      <v-dialog v-model="editDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Name*"
                    v-model="exerciseTitleEdit"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    :items="groups"
                    v-model="exerciseGroupEdit"
                    label="Choose group"
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Link*"
                    v-model="exerciseVideoEdit"
                    hint="Enter YouTube Link here"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-textarea
                  v-model="exerciseDescEdit"
                  solo
                  name="input-7-4"
                  label="Add description"
                ></v-textarea>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="editDialog = false"
              >Close</v-btn
            >
            <v-btn color="blue darken-1" text @click="saveEdits()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="pagTotal"
        :total-visible="7"
      ></v-pagination>
    </div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import store from "../../store/index";

import { getIdFromURL } from "vue-youtube-embed";

export default {
  async beforeRouteEnter(to, from, next) {
    await Promise.all([
      store.dispatch("collectExercise", { limit: 6, page: 1 }),
    ]).then(() => {
      next();
    });
  },
  data() {
    return {
      overlay: true,
      page: 1,
      pagTotal: 6,
      limit: 6,
      search: "",
      getterSearch: "",
      dialog: false,
      editDialog: false,
      exerciseGroup: "",
      exerciseVideo: "",
      exerciseTitle: "",
      exerciseDesc: "",
      exerciseIdEdit: null,
      exerciseGroupEdit: "",
      exerciseVideoEdit: "",
      exerciseTitleEdit: "",
      exerciseDescEdit: "",
      exercises: null,
      groups: ["abs", "legs", "shoulders", "arms", "back", "cardio", "chest"],
    };
  },
  mounted() {
    setTimeout(() => {
      let vm = this;
      vm.overlay = false;
    }, 1000);
  },

  computed: {
    getExercises() {
      this.exercises = this.$store.getters.getTrainings.data.exercises;

      let paginationData = this.$store.getters.getTrainings.totalResults;
      let paginationCalculate =  Math.ceil( paginationData / this.limit)
      this.pagTotal = paginationCalculate 

      return this.exercises;
    },
    changingPagination() {
      this.$store.dispatch("collectExercise", { limit: 6, page: this.page });
    },
  },
  watch: {
    page: function() {
      this.changingPagination();
    },
  },

  methods: {
    searchOption() {
      if (this.search == "") {
        this.$store.dispatch("collectExercise", { limit: 6, page: this.page });
      } else {
        this.$store.dispatch("searchExercise", this.search).then(() => {
          this.getExercises();
        });
      }
    },
      clearSearch(){
      this.search = ''
      this.$store.dispatch("collectExercise", { limit: 6, page: this.page });
    },

    addExerciseData() {
      if (
        this.exerciseGroup == "" ||
        this.exerciseVideo == "" ||
        this.exerciseTitle == "" ||
        this.exerciseDesc == ""
      ) {
        Toast.fire({
          icon: "warning",
          title: "Please enter all data",
        });
      } else {
        let obj = {
          title: this.exerciseTitle,
          videoURL: getIdFromURL(this.exerciseVideo),
          description: this.exerciseDesc,
          group: this.exerciseGroup,
        };

        this.$store.dispatch("addNewExercise", obj).then(() => {
          this.$store.dispatch("collectExercise", {
            limit: 6,
            page: this.page,
          });
        });

        Toast.fire({
          icon: "success",
          title: "New training added",
        });

        this.exerciseGroup = "";
        this.exerciseDesc = "";
        this.exerciseVideo = "";
        this.exerciseTitle = "";
        this.dialog = false;
      }
    },
    saveEdits() {
      if (
        this.exerciseGroupEdit == "" ||
        this.exerciseVideoEdit == "" ||
        this.exerciseTitleEdit == "" ||
        this.exerciseDescEdit == ""
      ) {
        Toast.fire({
          icon: "warning",
          title: "Please enter all for edit",
        });
      } else {
        let obj = {
          id: this.exerciseIdEdit,
          title: this.exerciseTitleEdit,
          videoURL: getIdFromURL(this.exerciseVideoEdit),
          description: this.exerciseDescEdit,
          group: this.exerciseGroupEdit,
        };
        this.$store.dispatch("updateExercise", obj).then(() => {
          this.$store.dispatch("collectExercise", {
            limit: 6,
            page: this.page,
          });
        });

        Toast.fire({
          icon: "success",
          title: "Training edited ",
        });

        this.$store.dispatch("collectExercise", { limit: 6, page: this.page });

        this.exerciseGroup = "";
        this.exerciseDesc = "";
        this.exerciseVideo = "";
        this.exerciseTitle = "";
        this.editDialog = false;
      }
    },
    preEditBind(data) {
      this.editDialog = true;
      this.exerciseIdEdit = data.id;
      this.exerciseGroupEdit = data.group;
      this.exerciseVideoEdit = data.videoURL;
      this.exerciseTitleEdit = data.title;
      this.exerciseDescEdit = data.description;
    },
    deleteExercise(id) {
    
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
            this.$store.dispatch("deleteExercise", id).then(() => {
              this.$store.dispatch("collectExercise", {
                limit: 6,
                page: this.page,
              });
            });

            swalWithBootstrapButtons.fire(
              "Deleted!",
              "Your data has been deleted.",
              "success"
            );
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "We didnt delete it!",
              "error"
            );
          }
        });
    },
 
  },
};
</script>

<style></style>
