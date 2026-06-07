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

function continueAsGuest() {
  router.push({ name: "shows" });
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
    
          <div>Personal Information</div>
          <v-row>
            <v-col>
              <div class="text-body-large text-large-emphasis mb-1">First Name *</div>
              <v-text-field
                v-model="user.firstName"
                density="compact"
                placeholder="Jane"
                required
                variant="outlined"
              >
              </v-text-field>
            </v-col>
            <v-col>
               <div class="text-body-large text-large-emphasis mb-1">Last Name *</div>
              <v-text-field
                v-model="user.lastName"
                density="compact"
                placeholder="Doe"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
    
          <v-container>
            <v-divider></v-divider>
          </v-container>
    
          <div>Contact Information</div>
          <div class="text-body-large text-large-emphasis mb-1">Email Address *</div>
          <v-text-field
            v-model="user.email"
            density="compact"
            placeholder="jane.doe@example.com"
            required
            variant="outlined"
          ></v-text-field>
          <div class="text-body-large text-medium-emphasis mb-1">You'll use this to log in and receive tickets</div>

          <div class="text-body-large text-large-emphasis mb-1">Phone Number</div>
          <v-text-field
            v-model="user.phoneNumber"
            density="compact"
            placeholder="(999) 999-9999"
            variant="outlined"
          ></v-text-field>
          <div class="text-body-large text-medium-emphasis mb-1">Optional - for booking confirmations</div>

          <v-container>
            <v-divider></v-divider>
          </v-container>

          <div>Account Security</div>
          <div class="text-body-large text-large-emphasis mb-1">Password *</div>
          <v-text-field
            v-model="user.password"
            density="compact"
            placeholder="abc123"
            required
            variant="outlined"
          ></v-text-field>
          <div class="text-body-large text-medium-emphasis mb-1">Must be at least 8 characters</div>

          <div class="text-body-large text-large-emphasis mb-1">Confirm Password *</div>
          <v-text-field
            v-model="user.password"
            density="compact"
            placeholder="abc123"
            required
            variant="outlined"
          ></v-text-field>
        </v-card-text>

        <v-footer color="secondary">
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="px-4"
                variant="outlined"
                color="primary"
                @click="closeCreateAccount()"
                >Cancel</v-btn
              >
              <v-btn 
                variant="flat"
                color="primary"
                class="px-6"
                @click="createAccount()"
                >Create Account & Continue</v-btn
              >
          </v-card-actions>
        </v-footer>
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