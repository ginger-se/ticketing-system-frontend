<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import OrderServices from '../services/OrderServices';

const router = useRouter();
const innerCardDiv = ref('inner-card-div');
const cardStyle = ref('card-style');
const backBtn = ref('back-btn');
const continueBtn = ref('continue-btn');
const paymentMethod = ref('payment-method');
const cardHeader = ref('card-header');
const selectedPayment = ref('');
const user = ref(null);
const selectedSeats = ref([]);
const seatIds = ref([]);
const totalAmount = ref(0);
const event = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  // selectedPayment.value = 'Card';
  user.value = JSON.parse(localStorage.getItem("user"));
  event.value = JSON.parse(localStorage.getItem("event"));
  selectedSeats.value = JSON.parse(localStorage.getItem("selectedSeats"));
  totalAmount.value = parseFloat(JSON.parse(localStorage.getItem("totalAmount")));
  buildSeatIds();
});

function buildSeatIds () {
  selectedSeats.value.forEach((seat) => {
    seatIds.value.push(seat.id); 
  })
}

function updatePaymentMethod(paymentType) {
  selectedPayment.value = paymentType;
}

function openBooking() {
  router.push({ name: "booking" });
}

async function completePurchase() {
  if (!selectedPayment.value) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Payment method must be selected!";
    return;
  }

  const checkoutDetails = {
    userId: user.value.id,
    eventId: event.value.id,
    totalAmount: totalAmount.value,
    paymentMethod: selectedPayment.value,
    seatIds: seatIds.value
  };

  await OrderServices.create(checkoutDetails)
    .then((response) => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Order created successfully!";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message || "Error completing purchase!";
    });
}
</script>

<template>
  <v-container>
    <v-row id="body-row" justify="center">
      <v-col id="body-col" cols="8">

        <div :class="cardHeader">Payment Method</div>

        <v-card :class="cardStyle" class="rounded-md" variant="outlined">
          <div :class="innerCardDiv">
            <div class="d-flex justify-space-between ga-8">
              <v-btn 
                :class="paymentMethod"
                :ripple="false"
                prepend-icon="mdi-credit-card-outline"
                variant="outlined"
                @click="updatePaymentMethod('Card')"
              >
                Card
              </v-btn>
              <v-btn 
                :class="paymentMethod"
                :ripple="false"
                variant="outlined"
                @click="updatePaymentMethod('GPay')"
              >
                G Pay
              </v-btn>
              <v-btn 
                :class="paymentMethod"
                :ripple="false"
                variant="outlined"
                @click="updatePaymentMethod('Apple Pay')"
              >
                Apple Pay
              </v-btn>
            </div>

            <div v-if="selectedPayment === 'Card'">
              <div class="text-body-large text-large-emphasis mb-1 mt-4">Card Number</div>
              <v-text-field
                density="compact"
                placeholder="1234 5678 9012 3456"
                variant="outlined"
                required
                bgColor="#f5f5f5"
              ></v-text-field>

              <div class="d-flex justify-space-between ga-4">
                <div class="flex-grow-1">
                  <div class="text-body-large text-large-emphasis mb-1">Expiry Date</div>
                  <v-text-field
                    density="compact"
                    placeholder="1234 5678 9012 3456"
                    variant="outlined"
                    required
                    bgColor="#f5f5f5"
                  ></v-text-field>
                </div>
                <div class="flex-grow-1">
                  <div class="text-body-large text-large-emphasis mb-1">CVV</div>
                  <v-text-field
                    density="compact"
                    placeholder="123"
                    variant="outlined"
                    required
                    bgColor="#f5f5f5"
                  ></v-text-field>
                </div>
              </div>
            </div>

            <div v-else class="mb-8">

            </div>

            <div class="d-flex ga-3 mt-4">
              <v-btn 
                :class="backBtn"
                variant="flat"
                prepend-icon="mdi-arrow-left"
                @click="openBooking()"
              >
                Back
              </v-btn>
              <v-btn
                :class="continueBtn" 
                variant="flat" 
                color="primary"
                @click="completePurchase()"
              > Complete Purchase - ${{ totalAmount.toFixed(2) }}
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.card-header {
  font-weight: 500;
  letter-spacing: 2%;
  font-size: larger;
  margin-bottom: 1rem;
}

.inner-card-div {
  margin: 1.2rem;
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
  background-color: #f5f5f5;
}
.continue-btn {
  flex-grow: 1;
}

.payment-method {
  flex-grow: 1;
  border: 2px solid #c3c3c3;
  height: 2.6rem;
}

.payment-method:focus {
  border: 2px solid rgb(143, 6, 6);
  background-color: rgba(252, 225, 225, 0.219);
}

#body-row {
  margin: 0;
}
</style>