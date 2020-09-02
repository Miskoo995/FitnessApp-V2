<template>
  <div>
    <h1>Profile Settings</h1>
    <v-card class="mx-auto" max-width="344" outlined>
      <v-row>
        <v-col cols="10">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4"></div>
              <v-list-item-subtitle> Email : {{ email }}</v-list-item-subtitle>
              <div v-if="isEditing">
                <v-list-item-title class="headline my-6" v-model="name">
                  Name : {{ name }}</v-list-item-title
                >
              </div>
              <v-text-field
                class="input-name "
                v-else
                v-model="name"
              ></v-text-field>

              <div v-if="isEditing">
                <v-list-item-title class="headline mb-4" v-model="gender"
                  >Gender: {{ gender }}</v-list-item-title
                >
              </div>

              <v-select
                v-else
                :items="items"
                :label="gender"
                v-model="gender"
              ></v-select>
            </v-list-item-content>

            <v-avatar class="ml-10" color="indigo">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-list-item>

          <v-card-actions>
            <v-btn @click="editUser" color="primary" text v-if="isEditing"
              ><v-icon left>mdi-pencil</v-icon> Edit</v-btn
            >

            <v-btn @click="editUser" color="primary" text v-else
              ><v-icon left>mdi-pencil</v-icon> Save</v-btn
            >
            <v-btn color="error" class="mr-12" text @click="deleteAccount"
              ><v-icon left>mdi-delete</v-icon> Delete</v-btn
            >
            <v-dialog v-model="dialog" persistent max-width="380px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on" icon>
                  <v-icon left>mdi-key</v-icon> Change <br />
                  Password</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline ml-12">Change Password <v-icon left>mdi-key</v-icon> </span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Old Password*"
                          class="password-input"
                          v-model="oldPassword"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Password*"
                          class="password-input"
                          v-model="password"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          class="password-input"
                          label=" Confirm Password*"
                          v-model="repeatPassword"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false"
                    >Close</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="changePassword"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import store from "../../store/index";
export default {
  beforeRouteEnter(to, from, next) {
    store.dispatch("getMe").then(() => {
      next();
    });
  },
  mounted() {
    this.name = store.getters.getUserDetails.name;
    this.email = store.getters.getUserDetails.email;
    this.gender = store.getters.getUserDetails.gender;
  },
  data() {
    return {
      items: ["Male", "Female"],
      name: null,
      email: null,
      gender: null,
      isEditing: true,
      dialog: false,
      password: null,
      repeatPassword: null,
      oldPassword: null,
    };
  },
  methods: {
    editUser() {
      if (this.name !== "") {
        this.isEditing = !this.isEditing;
        this.$store.dispatch("editUser", {
          gender: this.gender,
          name: this.name,
        });
      } else {
        Toast.fire({
          icon: "warning",
          title: "Name can't be empty",
        });
      }
    },
deleteAccount(){
swalWithBootstrapButtons.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, cancel!',
  reverseButtons: true
}).then((result) => {
  if (result.value) {
  
    swalWithBootstrapButtons.fire(
      this.$store.dispatch("deleteUser"),
      'Deleted!',
      'Your account has been deleted.',
      'success'
    )

  } else if (
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire(
      'Cancelled',
      'Your profile is safe :)',
      'success'
    )
  }
})

    },
    changePassword() {
      if (this.oldPassword == null) {
        Toast.fire({
          icon: "warning",
          title: "Please enter old password",
        });
      } else if (this.password == null || this.repeatPassword == null) {
        Toast.fire({
          icon: "warning",
          title: "Enter New passwords",
        });
      } else if (this.password !== this.repeatPassword) {
        Toast.fire({
          icon: "warning",
          title: "Passwords must match",
        });
      } else {
        this.dialog = false;

        this.$store.dispatch("changePassword", {
          oldPassword: this.oldPassword,
          newPassword: this.password,
          passwordConfirm: this.repeatPassword,
        });
        if (this.$store.getters.usersGlobalError !== null) {
          Toast.fire({
            icon: "warning",
            title: this.$store.getters.usersGlobalError,
          });
        } else {
          Toast.fire({
            icon: "success",
            title: "Password is updated",
          });
        }
      }
    },
  },
};
</script>

<style>
.input-name {
  width: 80px;
}
.password-input {
  width: 220px;
  margin: auto;
}
</style>
