<script setup>
import { onMounted } from "vue";
import { ref, toRaw, computed, shallowRef } from "vue";
import { useRouter } from "vue-router";
import SeatServices from "../services/SeatServices";

const router = useRouter();
const screen = ref('screen');
const seatingCard = ref('seating-card');
const seatingContainer = ref('seating-container');
const selectedSeats = ref([]);
const retrievedSeats = ref([]);
const seatMap = ref({});
const selected = ref('selected');
const taken = ref('taken');
const wheelchair = ref('wheelchair');
const rowHeaders = ref('row-headers');
const colHeaders = ref('col-headers');
const seatColor = ref('seat-color');
const legendColor = ref('legend-color');
const continueButton = ref('continue-button');
const isNonClickableButton = shallowRef(true);
const user = ref(null);

const numberOfSelectedSeats = computed(() => {
  return selectedSeats.value.length;
});

const headerRow = ['', 1, 2, '', 3, 4, 5, 6, 7, 8, '', 9, 10];

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getSeats();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getSeats() {
  await SeatServices.getSeats()
    .then((response) => {
      retrievedSeats.value = Array.isArray(response.data)
        ? response.data
        : [];
      convertToSeatMap(retrievedSeats.value);
    })
    .catch((error) => {
      console.log(error);
      retrievedSeats.value = [];
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message || "Error loading seats";
    });
}

function convertToSeatMap(rawData) {
  for (const seat of rawData) {
    if (seat.seatNumber >= 1 && seat.seatNumber <= 10) {
      if (seatMap.value[seat.rowNumber]) {
        seatMap.value[seat.rowNumber].push(seat);
      }
      else {
        seatMap.value[seat.rowNumber] = [seat];
      }
    }
  }
}

function locateSeat(seat) {
  return selectedSeats.value.findIndex(s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber);
}

function seatToggle(seat) {
  const found = locateSeat(seat);
  
  if (found === -1) {
    selectedSeats.value.push(seat);
  }
  else {
    selectedSeats.value.splice(found, 1);
  }
}

function isSeatSelected(seat) {
  return selectedSeats.value.includes(seat);
}

function calculateSeatCol(seatNumber) {  
  if (seatNumber > 8) {
    return seatNumber + 3;
  }
  else if (seatNumber > 2) {
    return seatNumber + 2;
  }
  else {
    return seatNumber + 1;
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function openBooking() {
  window.localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats.value));
  router.push({ name: "booking" });
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row id="reservationTimer">
        <h3>Select Your Seats</h3>
      </v-row>

      <v-row justify="center" class="mt-7">
        <v-col>
          <v-card :class="seatingCard" class="rounded-md elevation-2">
            <v-row justify="center" :class="screen" class="mb-3 bg-grey-darken-4">SCREEN</v-row>
            <div :class="seatingContainer">
              <!-- Generate the column headers -->
              <template v-for="header in headerRow" :key="header">
                <div>
                  <v-btn variant="text" :class="colHeaders" :readonly="isNonClickableButton">
                    {{ header }}
                  </v-btn>
                </div>
              </template>
  
              <!-- Generate the row headers -->
              <template v-for="(seatsArray, rowNumber) in seatMap" :key="rowNumber">
                <div :class="rowHeaders" style="grid-column: 1;">
                  <v-btn variant="text" :readonly="isNonClickableButton">
                    {{ rowNumber }}              
                  </v-btn>
                </div>
  
                <!-- Loop through the seats within a row in the seat map -->
                <template v-for="seat in seatsArray" :key="seat.seatNumber">
                  <div v-if="seat.isHandicap === false" :style="{ gridColumn: calculateSeatCol(seat.seatNumber) }" @click="seatToggle(seat)">
                    <v-btn :class="isSeatSelected(seat) ? 'selected' : 'seatColor'" variant="text">
                      <v-icon>
                        {{ isSeatSelected(seat) ? 'mdi-sofa-single' : 'mdi-sofa-single-outline' }}
                      </v-icon>
                    </v-btn>
                  </div>
  
                  <div v-else :style="{ gridColumn: calculateSeatCol(seat.seatNumber) }" @click="seatToggle(seat)">
                    <v-btn :class="isSeatSelected(seat) ? 'selected' : 'wheelchair'" variant="text">
                      <v-icon>
                        mdi-wheelchair-accessibility
                      </v-icon>
                    </v-btn>
                  </div>
                </template>
              </template>
            </div>
  
            <v-row class="mb-4 justify-center ga-6">
              <v-col class="d-flex ga-2 justify-center" cols="auto">
                <v-icon :class="seatColor">mdi-sofa-single-outline</v-icon>
                <span :class="legendColor">Available</span>
              </v-col>
  
              <v-col class="d-flex ga-2 justify-center" cols="auto">
                <v-icon color="rgb(240, 162, 60)">mdi-sofa-single</v-icon>
                <span :class="legendColor">Selected ({{ numberOfSelectedSeats }})</span>
              </v-col>
  
              <v-col class="d-flex ga-2 justify-center" cols="auto">
                <v-icon :class="taken">mdi-sofa-single</v-icon>
                <span :class="legendColor">Taken</span>
              </v-col>
  
              <v-col class="d-flex ga-2 justify-center" cols="auto">
                <v-icon :class=wheelchair>mdi-wheelchair-accessibility</v-icon>
                <span :class="legendColor">Wheelchair Accessible</span>
              </v-col>
            </v-row>
          </v-card>

          <v-btn
            :class="continueButton" 
            color="primary" 
            class="mt-6"
            @click="openBooking()"
          >
            Continue to Checkout ({{ numberOfSelectedSeats }} {{ numberOfSelectedSeats === 1 ? "seat" : "seats" }})
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.seating-container {
  padding: 1.4rem 3rem;
  color: #b3b1b1;
  display: grid;
  grid-template-columns: repeat(13, 1fr);
}

.screen {
  padding: 0.4rem 0;
  border-top-left-radius: 80%;
  border-top-right-radius: 80%;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  letter-spacing: 0.1rem;
}

.selected {
  color: rgb(240, 162, 60);
  background-color: rgba(250, 196, 120, 0.281);
  border: 1px solid rgb(206, 211, 212);
}

.seating-card {
  padding: 2.2rem 2rem 0;
  background-color: rgb(90, 88, 84)
}

#reservationTimer {
  padding: 1rem;
}

.wheelchair {
  color:rgb(142, 248, 248);
}

.seat-color {
  color: #b3b1b1;
}

.legend-color {
  color: #e0dbdb;
}

.taken {
  color: #05010c;
}

.row-headers {
  color: #7eff84b7;
  justify-content: center;
}

.col-headers {
  color: #7eff84b7;
  align-items: start;
}

.continue-button {
  width: 100%;
  height: 3.2rem;
}
</style>