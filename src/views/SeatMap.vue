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

const seatMap = ref([
  [ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
  [ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
  [ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
  [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
  [ 0, 0, 0, 1, 2, 1, 2, 2, 1, 2, 1, 0, 0, 0 ],
  [ 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2 ],
  [ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
  [ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
  [ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
  [ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1 ],
]);

const retrievedSeats = ref([]);
const seatMap = ref(new Map());


const headerRow = ['', 1, 2, '', 3, 4, 5, 6, 7, 8, 9, 10, '', 11, 12];

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
      console.log(retrievedSeats.value);
      convertToSeatMap(retrievedSeats);
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
    if (seatMap.value.has(seat.rowNumber)) {
      seatMap.value.get(seat.rowNumber).push(seat); 
    }
    else {
      seatMap.value.set(seat.rowNumber, [seat]);
    }
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function mapNumberToLetter(num) {
  return String.fromCharCode(num + 65);
}

function locateSeat(rowNumber, seatNumber) {
  return selectedSeats.value.findIndex(seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber);
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

</script>

<template>
  <v-container>
    <div id="body">
      <v-row id="reservationTimer">
        <h3>Select Your Seats</h3>
      </v-row>

      <v-row justify="center" class="mt-7">
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

            <!-- Loop through the rows in the seat map -->
            <template v-for="[rowNumber, seatsArray] in seatMap" :key="rowNumber">
              <div>
                <v-btn variant="text" :class="colHeaders" :readonly="isNonClickableButton">
                  {{ rowNumber }}              
                </v-btn>
              </div>

              <!-- Loop through the seats within a row in the seat map -->
              <div v-for="seat in seatsArray" :key="seat">
                <div v-if="seat.isHandicap === false" @click="seatToggle(seat)">
                  <v-btn :class="isSeatSelected(seat) ? 'selected' : 'seatColor'" variant="text">
                    <v-icon>
                      {{ isSeatSelected(seat) ? 'mdi-sofa-single' : 'mdi-sofa-single-outline' }}
                    </v-icon>
                  </v-btn>
                  <v-btn v-if="seat.seatNumber === 2 || seat.seatNumber === 8" variant="text" :readonly="isNonClickableButton">
                  </v-btn>
                </div>

                <div v-else @click="seatToggle(seat)">
                  <v-btn :class="isSeatSelected(seat) ? 'selected' : 'wheelchair'" variant="text">
                    <v-icon>
                      mdi-wheelchair-accessibility
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
          </div>

          <v-row class="mb-4 justify-center ga-6">
            <v-col class="d-flex ga-2 justify-center" cols="auto">
              <v-icon :class="seatColor">mdi-sofa-single-outline</v-icon>
              <v-text :class="legendColor">Available</v-text>
            </v-col>

            <v-col class="d-flex ga-2 justify-center" cols="auto">
              <v-icon color="rgb(240, 162, 60)">mdi-sofa-single</v-icon>
              <v-text :class="legendColor">Selected ({{ numberOfSelectedSeats }})</v-text>
            </v-col>

            <v-col class="d-flex ga-2 justify-center" cols="auto">
              <v-icon :class="taken">mdi-sofa-single</v-icon>
              <v-text :class="legendColor">Taken</v-text>
            </v-col>

            <v-col class="d-flex ga-2 justify-center" cols="auto">
              <v-icon :class=wheelchair>mdi-wheelchair-accessibility</v-icon>
              <v-text :class="legendColor">Wheelchair Accessible</v-text>
            </v-col>
          </v-row>
        </v-card>
      </v-row>

      <v-row class="justify-center pt-4 mb-8 text-center">
        <v-btn :class="continueButton" color="primary">
          Continue to Checkout ({{ numberOfSelectedSeats }} {{ numberOfSelectedSeats === 1 ? "seat" : "seats" }})
        </v-btn>
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
  grid-template-columns: repeat(15, 1fr);
  grid-template-rows: repeat(11, 1fr);
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
  width: 94%;
  height: 3rem;
}
</style>