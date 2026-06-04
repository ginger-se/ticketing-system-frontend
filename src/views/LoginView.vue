<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const visible = ref(false);
const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

onMounted(async () => {
  localStorage.removeItem("user");
  // if (localStorage.getItem("user") !== null) {
  //   router.push({ name: "recipes" });
  // }
});

function navigateToRecipes() {
  router.push({ name: "shows" });
}

async function createAccount() {
  await UserServices.addUser(user.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Account created successfully!";
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function login() {
  await UserServices.loginUser(user)
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      if (data.data.userType === "admin") {
        router.push({ name: "adminShows" });
      } 
      else {router.push({ name: "shows" });}
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container class="fluid fill-height">
    <v-row align="center" justify="center">
      <v-col cols="8">
        <v-card>
          <v-card-title class="text-center">
              Welcome to Planetarium
          </v-card-title>
             
          <v-card-text>
            <div class="text-body-large text-medium-emphasis">Email</div>
            <v-text-field
                density="compact"
                placeholder="john.doe@gmail.com"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
            ></v-text-field>

            <div class="text-body-large text-medium-emphasis">Password</div>
            <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Test1234"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                @click:append-inner="visible = !visible"
            ></v-text-field>
            <v-btn color="primary" block>Log In</v-btn>
  
            <div class="d-flex align-sm-center my-4">
                <v-divider></v-divider>
                <span class="mx-4">or</span>
                <v-divider></v-divider>
            </div>
  
            <v-btn color="secondary" block @click="openCreateAccount()">Create New Account</v-btn>
            <v-btn class="my-6" color="secondary" block>Continue as Guest</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- <v-dialog persistent v-model="isCreateAccount" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Create Account </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="user.firstName"
            label="First Name"
            required
          ></v-text-field>
  
          <v-text-field
            v-model="user.lastName"
            label="Last Name"
            required
          ></v-text-field>
  
          <v-text-field
            v-model="user.email"
            label="Email"
            required
          ></v-text-field>
  
          <v-text-field
            v-model="user.password"
            label="Password"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeCreateAccount()"
            >Close</v-btn
          >
          <v-btn variant="flat" color="primary" @click="createAccount()"
            >Create Account</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <v-dialog persistent v-model="isCreateAccount" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-toolbar color="primary">
          <v-toolbar-title>
            Create Your Account
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- <v-card-title class="headline mb-2">Create Account </v-card-title> -->

        <v-card-text>

          <v-alert>
            Create an account to save your tickets, manage bookings,
            and get exclusive updates!
          </v-alert>

          <v-text-field
            v-model="user.firstName"
            label="First Name"
            required
          ></v-text-field>
  
          <v-text-field
            v-model="user.lastName"
            label="Last Name"
            required
          ></v-text-field>
  
          <v-text-field
            v-model="user.email"
            label="Email"
            required
          ></v-text-field>
  
          <v-text-field
            v-model="user.password"
            label="Password"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeCreateAccount()"
            >Close</v-btn
          >
          <v-btn variant="flat" color="primary" @click="createAccount()"
            >Create Account</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
  
      <template v-slot:actions>
        <v-btn
          :color="snackbar.color"
          variant="text"
          @click="closeSnackBar()"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>