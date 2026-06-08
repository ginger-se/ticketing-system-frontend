<script setup>
import { onMounted, ref } from "vue";
import EventServices from "../services/EventServices.js";

const events = ref([]);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getEvents();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getEvents() {
  await EventServices.getEvents()
    .then((response) => {
      events.value = Array.isArray(response.data) 
        ? response.data.filter(e => e.status === "Scheduled") 
        : [];
      console.log(events.value);
    })
    .catch((error) => {
      console.log(error);
      events.value = [];
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message || "Error loading events";
    });
}

function getEventLength(event) {
  let difference = new Date(event.endTime) - new Date(event.startTime);
  let seconds = Math.floor(difference / 1000);
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  return hours + 'hr ' + minutes + 'min';
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card
        class="bg-primary w-90 rounded-lg my-10 d-flex justify-center align-center"
        elevation="4"
        style="height: 30vh"
      >
        <div class="d-flex flex-column align-center">
          <v-card-title>Journey Through The Cosmos</v-card-title>
          <v-card-subtitle>Experience the wonders of the universe.</v-card-subtitle>
          <v-btn
            class="my-4 border-sm border-secondary bg-transparent border-opacity-100 rounded-lg pa-2"
            @click="$router.push({ name: 'shows' })"
          >
            Browse Shows
          </v-btn>
        </div>
      </v-card>

      <div class="d-flex mb-3">
        <h3>Upcoming Events</h3>
        <router-link
          class="ml-auto text-decoration-none text-black"
          :to="{ name: 'events' }"
        >
          <span>view all</span>
        </router-link>
      </div>

      <div class="d-flex flex-wrap">
        <v-card
          v-for="event in events"
          :key="event.id"
          class="ma-2"
          style="width: 30%;"
          elevation="4"
          @click="$router.push({ name: 'eventList', params: { id: event.show ? event.show.id : event.showId } })"
        >
          <v-card-title>{{ event.show ? event.show.title : 'Unknown Show' }}</v-card-title>
          <div class="pb-2 d-flex">
            <div class="d-flex flex-column w-50">
              <v-card-subtitle>
                {{ new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
              </v-card-subtitle>
              <v-card-subtitle>{{ getEventLength(event) }}</v-card-subtitle>
            </div>
            <v-card-text>Capacity: {{ event.capacity }}</v-card-text>
          </div>
        </v-card>
      </div>

      <v-card v-if="events.length === 0" class="my-5 elevation-2" variant="outlined">
        <v-card-text>No upcoming events at this time.</v-card-text>
      </v-card>
    </div>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="snackbar.value = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>