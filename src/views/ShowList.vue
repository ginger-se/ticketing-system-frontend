<script setup>
import { onMounted } from "vue";
import { ref } from "vue";

import ShowServices from "../services/ShowServices.js";
const shows = ref([]);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getShows();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getShows() {
  await ShowServices.getShows()
    .then((response) => {
      shows.value = response.data;
      console.log(shows.value);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card-title class="pl-0 text-h4 font-weight-bold">
        Offered Shows
      </v-card-title>
      <v-card v-for="show in shows" class="my-5 elevation-2" color="" variant="outlined" :title="show.title" :subtitle="'Price: $' + (show.price / 100).toFixed(2)" >
        <div class="d-flex">
            <v-card-text class="pt-0">{{ show.description.substring(0, 150) + '...' }}</v-card-text>
            <v-card-actions class="justify-end">
              <v-btn class="bg-primary">View Show Times</v-btn>
            </v-card-actions>
          </div>
      </v-card>  
    </div>
  </v-container>
</template>
