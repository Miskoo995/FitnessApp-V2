
<template>
  <v-app>
    <v-template>
      <v-row class="ml-4">
        <v-col class="mx-10  pl-10 mt-12">
          <h1 class="mb-7 mt-12"><strong>Sign Up</strong></h1>
          <h4 class="mb-7  ">Start your healthy lifestyle now</h4>
          <img width="500" :src="require('../photos/training5.svg')" alt="" />
        </v-col>

        <v-col class="right">
          <v-row>
           
            
            <div class="nav-details">
              <Navigation />
            </div>
          </v-row>

          <v-row class="ml-12 mt-12">
            <v-card
              class="d-flex flex-column  ml-12 mt-10 pl-5"
              width="450"
              height="430"
             :elevation="20"
            >
              <v-col cols="11">
                <v-text-field
                  v-model="name"
                  :counter="10"
                  label="Name"
                  class="mx-4 my-4"
                ></v-text-field>
                <v-text-field
                  type="password"
                  v-model="password"
                  label="Password"
                  class="mx-4 my-4"
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  label="E-mail"
                  class="mx-4 my-4"
                ></v-text-field>
                <v-select
                  :items="items"
                  v-model="gender"
                  :value="items"
                  label="Gender"
                  class="mx-4 my-4"
                ></v-select>

                <v-btn class="mx-1 my-4" block @click="register" color="primary"
                  >Sign Up</v-btn
                >
              </v-col>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-template>
  </v-app>
</template>

<script>


import Navigation from "../components/Nav";

export default {
  name: "register",

  data() {
    return {
      items: ["Male", "Female"],
      email: "",
      password: "",
      gender: "Male",
      user_id: null,
      name: "",
      registerData: null,
    };
  },
  components: {
    Navigation,
  },


  methods: {
  register: function(e) {
      if (this.name !== "" && this.email !== "" && this.password !== "") {
  
          
            this.$store.dispatch("signUp", {
              
                email: this.email,
                password : this.password,
                passwordConfirm: this.password,
                gender: this.gender,
                name :this.name
              });
              Toast.fire({
                icon: "success",
                title: `You are successfully registred! as ${this.email} </br> Inform your instuctor. `,
                position: "center",
              });

          
        if (this.$store.getters.usersGlobalError !== null) {
          Toast.fire({
            icon: "warning",
            title: this.$store.getters.usersGlobalError,
          });
        }
            
      } else {
        e.preventDefault();
        Toast.fire({
          icon: "warning",
          title: "Please enter all data",
        });
      }
    },
  }, 
};
</script>
<style>
.svg {
  transform: rotate(90deg);
  z-index: -1;

  top: 0;
}
.svg-holder {
  position: relative;
}

.right {
  top: 0;
  right: 0;
  height: 100vh;
  background-color: #00b7ff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='540' height='450' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='.1'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.nav-details {
  margin-top: 2%;
  margin-left: 60%;
  background-color: transparent;
}
</style>
