<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import EventServices from "../services/EventServices.js";
import ShowServices from "../services/ShowServices.js";

const route = useRoute();
const router = useRouter();
const events = ref([]);
const show = ref({});
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getShow();
  await getEvents();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getShow() {
  await ShowServices.getShow(route.params.id)
    .then((response) => {
      show.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getEvents() {
  await EventServices.getEventsByShowId(route.params.id)
    .then((response) => {
      events.value = response.data;
      console.log(events.value);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message || "Error loading events";
    });
}

function openSeatMap() {
  router.push({ name: "seatmap" });
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card-title class="pl-0 text-h4 font-weight-bold mb-4">
        {{ show.title }} — Show Times
      </v-card-title>

      <v-card
        v-for="event in events"
        :key="event.id"
        class="my-5 elevation-2"
        variant="outlined"
        :title="new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })"
        :subtitle="'Speaker: ' + (show.speakerInfo || 'TBD') + '  |  Capacity: ' + event.capacity + ' seats  |  Price: $' + parseFloat(show.price).toFixed(2)"
      >
        <div class="d-flex">
          <v-card-text class="pt-0">
            Start: {{ new Date(event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
            — 
            End: {{ new Date(event.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
            <v-chip
              class="ml-3"
              :color="event.status === 'Scheduled' ? 'green' : event.status === 'Cancelled' ? 'error' : 'grey'"
              size="small"
            >
              {{ event.status }}
            </v-chip>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              class="bg-primary"
              :disabled="event.status !== 'Scheduled'"
              @click="openSeatMap()"
            >
              Book Now
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>

      <v-card v-if="events.length === 0" class="my-5 elevation-2" variant="outlined">
        <v-card-text>No upcoming events for this show.</v-card-text>
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