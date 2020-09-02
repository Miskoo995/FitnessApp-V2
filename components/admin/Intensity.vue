<template>
  <v-container>
    <v-row justify="space-around">
      <div v-for="intensities in getIntensityData" :key="intensities.id">
        <v-sheet
          elevation="20"
          :color="intensities.color"
          class="mx-auto "
          height="130"
          width="200"
        >
          <v-row>
            <v-col class="mx-5">
              <h4>{{ intensities.name }}</h4>
              <h6>Sets : {{ intensities.sets }}</h6>
              <h6>Reps: {{ intensities.repetitions }}</h6>
              <h6>Break: {{ intensities.break }} min</h6>
            </v-col>

            <v-btn
              @click="deleteInt(intensities.id)"
              color="grey lighten-5"
              fab
              x-small
              white
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-row>
        </v-sheet>
      </div>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn
          class="mx-2"
          absolute
          right
          bottom
          v-on="on"
          fab
          dark
          color="indigo"
        >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-form>
        <v-card>
          <v-card-title>
            <span class="headline">Add New Intensity</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    type="number"
                    min="1"
                    label="Break / minutes*"
                    hint="How many min for brake?"
                    v-model="breaks"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    min= 1
                    type="number"
              
                    label="Reps*"
                    hint="How many repetition you need?"
                    v-model="reps"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    type="number"
                    min="1"
                    label="Sets*"
                    hint="How many sets do you need?"
                    persistent-hint
                    v-model="sets"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Name*"
                    v-model="name"
                    :rules="nameRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-color-picker
                  width="400px"
                  v-model="colorPicked"
                  hide-inputs
                ></v-color-picker>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false"
              >Close</v-btn
            >

            <v-btn color="blue darken-1" text @click="addIntensityData"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import store from "../../store/index";

export default {
  async beforeRouteEnter(to, from, next) {
    await Promise.all([store.dispatch("getIntensity")]).then(() => {
      next();
    });
  },

  data() {
    return {
      overlay: true,
      intensity: [],
      dialog: false,
      colorPicked: null,
      sets: "",
      reps: "",
      breaks: "",
      name: "",
      allIntensities: null,
    };
  },

  mounted() {
    setTimeout(() => {
      let vm = this;
      vm.overlay = false;
    }, 1000);
  },

  computed: {
    getIntensityData() {
      this.allIntensities = store.getters.getIntensities;
      return this.allIntensities;
    },
  },

  methods: {
    deleteInt(id) {
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
            this.$store.dispatch("deleteIntensity", id).then(()=>{
                   this.$store.dispatch("getIntensity")

            })
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your data has been deleted.",
                "success"
              );
            this.$store.dispatch("getIntensity");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              "Cancelled",
              "We didnt delete it!",
              "error"
            );
          }
        });
    },

    addIntensityData() {
      if (
        this.sets == "" ||
        this.reps == "" ||
        this.breaks == "" ||
        this.name == ""
      ) {
        Toast.fire({
          icon: "warning",
          title: "Please enter all data",
        });
      }  else if(this.sets == 0 || this.breaks == 0 || this.reps ==0){
      
         Toast.fire({
          icon: "warning",
          title: "Intensity data can't be zero",
        });
      
     } else {
        let obj = {
          name: this.name,
          color: this.colorPicked.hex,
          repetitions: this.reps,
          sets: this.sets,
          break: this.breaks,
        };

        this.$store.dispatch("addIntensity", obj).then(()=>{
           this.$store.dispatch("getIntensity");
        })

        Toast.fire({
          icon: "success",
          title: "New record added",
        });

        this.sets = "";
        this.reps = "";
        this.breaks = "";
        this.name = "";
        this.dialog = false;
      }

    
    
    },
  },
};
</script>

<style scoped>
h6,
h4 {
  color: #ffff;
}
</style>
