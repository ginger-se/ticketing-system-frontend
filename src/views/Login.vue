<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const isCreateAccount = ref(false);
const visible = ref(false);
const buttonClass = ref('button-style');
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
        router.push({ name: "adminDashboard" });
      } 
      else {router.push({ name: "home" });}
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function continueAsGuest() {
  router.push({ name: "home" });
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
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col cols="6">
        <v-card class="rounded-lg elevation-5 px-8">
        
          <v-card-title class="headline my-4 text-center">
            Welcome to Planetarium
          </v-card-title>
               
          <v-card-text>
            <div class="text-body-large text-large-emphasis mb-1">Email</div>
            <v-text-field
              v-model="user.email"
              density="compact"
              placeholder="jane.doe@gmail.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              required
            ></v-text-field>
    
            <div class="text-body-large text-large-emphasis mb-1">Password</div>
            <v-text-field
                v-model="user.password"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="abc123"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                @click:append-inner="visible = !visible"
                required
            ></v-text-field>
            
            <div id="buttonWrapper" class="d-flex align-center flex-column mt-4 mb-2">
              <v-btn :class="buttonClass" color="primary" @click="login()">Log In</v-btn>
              <v-container class="my-2">
                <v-divider>or</v-divider>              
              </v-container>
              <v-btn class="mb-2" :class="buttonClass" color="primary" variant="tonal" @click="openCreateAccount()">Create New Account</v-btn>
              <v-btn class="my-2" :class="buttonClass" variant="outlined" @click="continueAsGuest()">Continue as Guest</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
      
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
    
        <v-card-text>
    
          <v-alert>
            Create an account to save your tickets, manage bookings,
            and get exclusive updates!
          </v-alert>
    
          <v-row>
            <v-col>
              <v-text-field
                v-model="user.firstName"
                label="First Name"
                required
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="user.lastName"
                label="Last Name"
                required
              ></v-text-field>
            </v-col>
          </v-row>
    
          <v-divider></v-divider>
    
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

<style scoped>
.button-style {
  width: 48%;
}
</style>