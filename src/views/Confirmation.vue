<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import ShowServices from "../services/ShowServices";
import EventServices from "../services/EventServices";
import OrderServices from "../services/OrderServices";
import QRCode from 'qrcode';

const router = useRouter();
const route = useRoute();
const user = ref(null);
const selectedSeats = ref([]);
const innerCardDiv = ref('inner-card-div');
const cardStyle = ref('card-style');
const downloadBtn = ref('download-btn');
const viewTicketsBtn = ref('view-tickets-btn');
const showId = ref(null);
const eventId = ref(null);
const selectedShow = ref(null);
const selectedEvent = ref(null);
const orders = ref(null);
const qrCodes = ref([]);

const numberOfSelectedSeats = computed(() => {
  return selectedSeats.value.length;
});
  
onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "null" && storedUser !== "undefined") {
    user.value = JSON.parse(storedUser);
  }
  else {
    user.value = null;
  }
  showId.value = route.params.id;
  eventId.value = route.params.eventId;
  await getShowDetails();
  await getEventDetails();
  getSelectedSeats();
  generateQrCodes();
});

function getSelectedSeats() {
  selectedSeats.value = JSON.parse(localStorage.getItem("selectedSeats"));
}

async function getShowDetails() {
  await ShowServices.getShow(showId.value)
    .then((response) => {
      selectedShow.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message || "Error retrieving show details";
    });
}

async function getEventDetails() {
  await EventServices.getEvent(eventId.value)
    .then((response) => {
      selectedEvent.value = response.data.find(e => e.id == eventId.value);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message || "Error retrieving event details";
    });
}

function openProfile() {
  router.push({ name: "profile" });
  localStorage.removeItem("selectedSeats");
}

async function generateQrCodes(){
  await OrderServices.getOrder(localStorage.getItem("orderId"))
  .then((response) =>{
      orders.value = response.data;
      orders.value.orderTickets.forEach(async (ticket, index) => {
        try {
          let img = await QRCode.toDataURL(ticket.QRCode, {
            width: 200,
            margin: 2
          });
          qrCodes.value.push(img);
        } catch (err) {
        }
      });
    })
    .catch((error) =>{
    });
  
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="7">
        <div :class="bookingConfirmed" class="d-flex flex-column align-center ga-2">
          <div id="checkmark-background" class="d-flex justify-center align-center">
            <v-icon id="checkmark" size="50" color="green">
              mdi-check
            </v-icon>
          </div>
          <h2 class="mt-4">Booking Confirmed!</h2>
          <p>Your tickets have been sent to your email</p>
        </div>

        <v-card :class="cardStyle" class="mt-8" variant="outlined">
          <div :class="innerCardDiv">
            <div class="d-flex flex-column align-center">
              <div id="QRCode" class="w-100">
                <v-carousel  v-if="qrCodes.length > 0">
                  <v-carousel-item  v-for="(code,index) in qrCodes"
                    :src="code"
                    
                  > 
                  <h5 class="text-center">Ticket: {{ index + 1 }}</h5>
                  </v-carousel-item>
                </v-carousel>
              </div>
              <div v-if="selectedShow" class="mt-2">
                <h4>{{ selectedShow.title }}</h4>
              </div>
              <div v-if="selectedEvent" class="d-flex ga-2 mb-2">
                <span>
                  {{ new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                  - {{ selectedEvent.startTime }} 
                </span>
                <span>|</span>
                <div>
                  <div v-if="numberOfSelectedSeats > 1" class="d-flex ga-1">
                    <div>Seats</div>
                    <span v-for="(seat, index) in selectedSeats" :key="seat.id">
                      {{ seat.rowNumber }}{{  seat.seatNumber }}
                    </span>
                  </div>
                  <div v-else class="d-flex ga-1">
                    <div>Seat</div>
                    <span v-for="seat in selectedSeats" :key="seat.id">
                      {{ seat.rowNumber }}{{  seat.seatNumber }}
                    </span>
                  </div>                   
                </div>
              </div>
            </div>
          </div>
        </v-card>

        <div v-if="user !== null" class="d-flex ga-4 mt-6 justify-center">
          <v-btn 
            :class="viewTicketsBtn" 
            variant="flat" 
            color="primary"
            @click="openProfile()"
          >
            View My Tickets
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.inner-card-div {
  margin: 1.2rem;
}

.card-style {
  background-color: #ffffff;
  border: 1px solid #c3c3c3;
}

.download-btn, .view-tickets-btn {
  height: 2.6rem;
  text-transform: capitalize;
}

.download-btn {
  border: 1px solid #c3c3c3;
  background-color: #ececec;
}

#checkmark-background {
  background-color: rgb(203, 245, 203);
  border-radius: 50%;
  width: 70px;
  height: 70px;
}

h2 {
  font-weight: 400;
}
</style>