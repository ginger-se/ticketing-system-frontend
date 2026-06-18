<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import TicketServices from "../services/TicketServices.js";

const router = useRouter();
const tickets = ref([]);
const tab = ref("upcoming");
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  await getTickets();
});

async function getTickets() {
  await TicketServices.getTicketsForUser(user.value.id)
    .then((response) => {
      tickets.value = response.data;
      console.log(tickets.value);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message || "Error loading tickets";
    });
}

const upcomingTickets = computed(() =>
  tickets.value.filter((t) => new Date(t.event.startTime) >= new Date())
);

const pastTickets = computed(() =>
  tickets.value.filter((t) => new Date(t.event.startTime) < new Date())
);

function goToRefund(ticket) {
  router.push({ name: "requestRefund", params: { paymentId: ticket.paymentId } });
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-2">
        <v-col>
          <v-btn variant="text" :to="{ name: 'shows' }" class="mr-2">
            Shows
          </v-btn>
          <v-btn variant="text" :to="{ name: 'events' }">
            Events
          </v-btn>
        </v-col>
      </v-row>

      <v-card-title class="pl-0 text-h4 font-weight-bold mb-4">
        My Tickets
      </v-card-title>

      <v-tabs v-model="tab" class="mb-4">
        <v-tab value="upcoming">Upcoming</v-tab>
        <v-tab value="past">Past</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="upcoming">
          <v-card
            v-for="ticket in upcomingTickets"
            :key="ticket.id"
            class="my-5 elevation-2"
            variant="outlined"
            :title="ticket.event.show.title"
            :subtitle="new Date(ticket.event.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' - ' + new Date(ticket.event.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })"
          >
            <div class="d-flex">
              <v-card-text class="pt-0">
                Ticket Type: {{ ticket.ticketType }}
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn variant="outlined" class="mr-2">
                  Download
                </v-btn>
                <v-btn variant="outlined" color="error" @click="goToRefund(ticket)">
                  Request Refund
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>

          <v-card v-if="upcomingTickets.length === 0" class="my-5 elevation-2" variant="outlined">
            <v-card-text>
              No upcoming tickets.
              <v-btn variant="text" color="primary" :to="{ name: 'shows' }" class="ml-2">
                Browse Shows
              </v-btn>
            </v-card-text>
          </v-card>
        </v-window-item>

        <v-window-item value="past">
          <v-card
            v-for="ticket in pastTickets"
            :key="ticket.id"
            class="my-5 elevation-2"
            variant="outlined"
            :title="ticket.event.show.title"
            :subtitle="new Date(ticket.event.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })"
          >
            <div class="d-flex">
              <v-card-text class="pt-0">
                Ticket Type: {{ ticket.ticketType }}
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn variant="outlined">
                  Download
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>

          <v-card v-if="pastTickets.length === 0" class="my-5 elevation-2" variant="outlined">
            <v-card-text>No past tickets.</v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
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