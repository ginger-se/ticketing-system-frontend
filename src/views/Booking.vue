<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);
const selectedSeats = ref([]);
const colHeader = ref('col-header');
const innerCardDiv = ref('inner-card-div');
const cardStyle = ref('card-style');
const backBtn = ref('back-btn');
const continueBtn = ref('continue-btn');
const info = ref('info-box');
const red = ref('red-text');
const promoInput = ref(null);
const activePromo = ref(null);
const promoRemove = ref('promo-remove');
const promoText = ref('promo-text');
const promoApply = ref('promo-apply');
const discount = ref('discount');
const chipPrice = ref('chip-price');

const prices = [
  { age: 'Adult (Ages 13+)', price: 15.00 },
  { age: 'Child (Ages 9-12)', price: 10.00 },
  { age: 'Child (Free) (Ages 8 & under)', price: 0.00 },
  { age: 'Senior (Ages 65+)', price: 10.00 },
];

const promos  = ref([
  {
    "SAVE10": 0.10,
    "TAKE20": 0.20,
    "FIRST50": 0.50,
    "SUMMERSALE": 0.12
  }
]);

function applyPromo() {
  if (promoInput.value.trim().toUpperCase() in promos.value[0]) {
    activePromo.value = promos.value[0][promoInput.value.trim().toUpperCase()];
  }
}

function removePromo() {
  promoInput.value = null
  activePromo.value = null;
}

function addTicketType(seats) {
  for (const seat of seats) {
    seat.ticketType = prices[0];
  }
}

function getSelectedSeats() {
  selectedSeats.value = JSON.parse(localStorage.getItem("selectedSeats"));
}

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  getSelectedSeats();
  addTicketType(selectedSeats.value);
});

const subtotalPrice = computed(() => {
  let subtotal = 0;
  for (const seat of selectedSeats.value) {
    subtotal += seat.ticketType?.price || 0;
  }
  return subtotal;
});

const discountPrice = computed(() => {
  let discount = 0;
  if (activePromo?.value) {
    discount = subtotalPrice.value * activePromo.value;
  }
  return discount;
})

const totalPrice = computed(() => {
  return subtotalPrice.value - discountPrice.value;
})

function openSeatMap() {
  router.push({ name: "seatmap" });
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row id="body-row">
        <v-col id="body-col">
          <div id="cards" class="d-flex ga-10">
            <v-col style="flex-basis: 50%;" class="px-0">
              <div :class="colHeader">Order Summary</div>
              <v-card :class="cardStyle" class="rounded-md" variant="outlined">
                <div :class="innerCardDiv">
  
                    Need to insert the show details here
    
                  <v-container class="mb-1">
                    <v-divider></v-divider>
                  </v-container>
  
                  <div v-for="seat in selectedSeats" :key="seat.id">
                    <div class="d-flex justify-space-between">
                      <div class="d-flex flex-column align-center mr-5">
                        <div>Seat</div>
                        <div>{{ seat.rowNumber }}{{  seat.seatNumber }}</div>
                      </div>
                      <v-select
                        v-model="seat.ticketType"
                        :items="prices"
                        item-title="age"
                        item-value="price"
                        density="compact"
                        variant="outlined"
                        return-object
                        bgColor="#f5f5f5"
                      ></v-select>
                      <v-chip
                        variant="text"
                        :class="chipPrice"
                        class="ml-5"
                      >
                        ${{ seat.ticketType.price }}.00
                      </v-chip>
                    </div>
                  </div>
    
                  <v-container class="mx-0 pt-1">
                    <v-divider></v-divider>
                  </v-container>
  
                  <div v-if="activePromo === null">
                    <div class="d-flex ga-4">
                      <v-text-field
                        v-model="promoInput"
                        density="compact"
                        placeholder="PROMO CODE"
                        variant="outlined"
                        bgColor="#f5f5f5"
                      ></v-text-field>   
                      <v-btn 
                        @click="applyPromo"
                        :class="promoApply"
                        variant="flat"
                      >
                        Apply
                      </v-btn>
                    </div>
                  </div>

                  <div v-else>
                    <div class="d-flex justify-space-between mb-4">
                      <div :class="promoText">
                        Promo: <span style="letter-spacing: 4%;">{{ promoInput.trim().toUpperCase() }}</span> ({{ activePromo * 100 }}% off)
                      </div>   
                      <v-icon 
                        @click="removePromo"
                        :class="promoRemove"
                      >
                        mdi-close
                      </v-icon>
                    </div>
                  </div>
  
                  <v-container class="mt-0 pt-0 mx-0 px-0">
                    <v-divider></v-divider>
                  </v-container>
  
                  <div>
                    <div :class="subtotal" class="d-flex justify-space-between">
                      <div>
                        Subtotal
                      </div>
                      <div>
                        ${{ subtotalPrice.toFixed(2) }}
                      </div>
                    </div>
                    <div v-if="activePromo !== null" :class="discount" class="d-flex justify-space-between">
                      <div>
                        Discount
                      </div>
                      <div>
                        - ${{ discountPrice.toFixed(2) }}
                      </div>
                    </div>
                  </div>
  
                  <v-container class="mx-0 px-0">
                    <v-divider></v-divider>
                  </v-container>
  
                  <div id="total" class="d-flex justify-space-between">
                    <div>
                      Total
                    </div>
                    <div>
                      ${{ totalPrice.toFixed(2) }}
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
  
            <v-col style="flex-basis: 50%;" class="px-0"> 
              <div :class="colHeader">Contact Information</div>
              <v-card :class="cardStyle" class="rounded-md" variant="outlined">
                <div :class="innerCardDiv">
                  <div class="mb-1">Email <span :class="red">*</span></div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    bgColor="#f5f5f5"
                  >
                    {{ user === null ? 'your@email.com' : user.email }}
                  </v-text-field>

                  <div class="mb-1">Phone <span style="opacity: 0.6;">(optional)</span></div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    bgColor="#f5f5f5"
                  >
                    {{ user === null ? '(555) 123-4567' : user.phoneNumber }}
                  </v-text-field>
                </div>
              </v-card>
                
              <v-card-text id="price-info" class="mt-4">
                <div :class="info">
                  <div class="font-weight-medium mb-1">Age-based pricing</div>
                  <div>Adult (Ages 13+): $15.00</div>
                  <div>Child (Ages 9-12): $10.00</div>
                  <div>Child (Free) (Ages 8 & under): Free</div>
                  <div>Senior (Ages 65+): $10.00</div>
                </div>
              </v-card-text>
            </v-col>
          </div>

          <div class="d-flex ga-3 mt-4">
            <v-btn 
              :class="backBtn"
              variant="flat"
              prepend-icon="mdi-arrow-left"
              @click="openSeatMap()"
            >
              Back
            </v-btn>
            <v-btn 
              :class="continueBtn" 
              variant="flat" 
              color="primary"
            >
              Continue <span class="mx-1" style="text-transform: lowercase;"> to </span> Payment
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.promo-apply {
  background-color: rgba(14, 13, 13, 0.863);
  color: whitesmoke;
  text-transform: capitalize;
  height: 2.5rem;
}

.col-header {
  font-weight: 500;
  letter-spacing: 2%;
  font-size: larger;
  margin-bottom: 1rem;
}

.inner-card-div {
  margin: 1.2rem;
}

#price-info {
  padding: 0;
  margin: 0;
}

.info-box {
  background-color: rgba(187, 222, 251, .3);
  border: 1px solid lightblue;
  border-radius: 0.3rem;
  color: rgb(23, 100, 215);
  padding: 0.7rem 1rem;
}

.card-style {
  background-color: #ffffff;
  border: 1px solid #c3c3c3;
}

.back-btn, .continue-btn {
  height: 3rem;
  text-transform: capitalize;
}

.back-btn {
  width: 15%;
  border: 1px solid #c3c3c3;
  background-color: #ececec;
}

.continue-btn {
  flex-grow: 1;
}

#total, .chip-price {
  font-weight: 500;
}

.promo-remove {
  opacity: 0.6;
} 

.promo-text {
  color: green;
  font-weight: 500;
  letter-spacing: 2%;
}

.discount {
  color: rgb(100, 209, 100);
}

.red-text {
  color: red;
}
</style>