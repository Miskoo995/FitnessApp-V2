<template>
  <v-app>
    <v-template>
      <img
        width="500"
        class="image-shape"
        :src="require('../photos/wave.png')"
        alt=""
      />

      <v-row class="d-flex flex-row">
        <v-row>
          <v-col>
            <img
              width="150"
              class="ml-10"
              :src="require('../photos/logo.png')"
              alt=""
            />
          </v-col>
          <v-col>
            <v-row>
              <div class="nav-details mt-8">
                <Navigation />
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-row>
      <v-row class="mt-12 ml-5">
        <v-col>
          <v-row class="ml-5 my-6">
            <v-col class=" my-5">
              <v-row class="main-h">
                <transition
                    name="fadeLeft"
                    >
                  <h1 class="blue-text mx-4">Fitness</h1>
                </transition>
                <h1 class="">App</h1></v-row
              >

              <h3 class="my-6">Improve your training numbers with better planning. 💪</h3>
              <h5 class=" grey--text text--darken-1">Premium tailored planining,  great tracking experience and low pricing </h5>
            </v-col>
          </v-row>
          <v-row class="ml-10 mt-12">
            <v-btn
              rounded
              to="/login"
              color="blue lighten-1"
              class="white--text"
              x-large
              >Login</v-btn
            >
            <v-btn rounded to="/register" color="primary " class="mx-5 " x-large
              >Register</v-btn
            >
          </v-row>
        </v-col>
        <v-col class="image mt-12">
          <img
           
            width="700"
            :src="require('../photos/pc.png')"
            alt=""
          />
        </v-col>
      </v-row>
    </v-template>
  </v-app>
</template>

<script>
import Navigation from "../components/Nav";

export default {
  components: {
    Navigation,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap");

.main-h > h1 {
  font-family: "Black Han Sans", sans-serif;
  font-size: 5em;
}
.blue-text {
  color: #00b7ff;
}
.right-side {
  position: absolute;
  background-color: #5000ca;
  height: 100vh;
}
.image-shape {
  transform: skewX(20deg);
  transform: rotate(180deg);
  position: absolute;
 
  top: 0;
  right: 0;
  height: 100vh;
  width: 50vw;
}
.nav-details {
  margin-top: 2%;
  margin-left: 65%;
}
.image{

  z-index: 100;
}
</style>
