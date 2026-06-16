<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  seats: Array
})

const info = ref('info-box');

const promoApply = ref('promo-apply');

const colHeader = ref('col-header');

const innerCardDiv = ref('inner-card-div');

const cardStyle = ref('card-style');

const backBtn = ref('back-btn');
const continueBtn = ref('continue-btn');
const red = ref('red-text');



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
  
                    Need to insert the show instance here
    
                    <v-container>
                      <v-divider></v-divider>
                    </v-container>
    
                    <!-- Here we need to loop through the selected seats, and 
                    in each row provide the seat #, dropdown of ticket type,
                    and the price -->
                    <div class="d-flex ga-4">
                      <div class="d-flex flex-column">
                        <div>Seat</div>
                        <div>C5</div>
                      </div>
                      <v-select
                        density="compact"
                        variant="outlined"
                        :items="['Adult (Ages 13+)', 'Child (Ages 9-12)', 'Child (Free) (Ages 8 & under)', 'Senior (Ages 65+)']"
                      >
                      </v-select>
                      <div>
                        Price
                      </div>
                    </div>
    
                    <v-container>
                      <v-divider></v-divider>
                    </v-container>
    
                    <div class="d-flex ga-4">
                      <v-text-field
                        density="compact"
                        placeholder="PROMO CODE"
                        variant="outlined"
                      ></v-text-field>   
                      <v-btn 
                        :class="promoApply"
                        variant="flat"
                      >Apply</v-btn>
                    </div>
    
                    <v-container>
                      <v-divider></v-divider>
                    </v-container>
    
                    <div id="subtotal">
                      Subtotal
                    </div>
    
                    <v-container>
                      <v-divider></v-divider>
                    </v-container>
    
                    <div id="total">
                      Total
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
                  ></v-text-field>

                  <div class="mb-1">Phone</div>
                  <v-text-field
                    density="compact"
                    variant="outlined"
                  ></v-text-field>
                </div>
              </v-card>
                
              <v-card-text id="price-info" class="rounded-md mt-4">
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
            <v-btn :class="continueBtn" variant="flat" color="primary">Continue <span class="mx-1" style="text-transform: lowercase;"> to </span> Payment</v-btn>
          </div>

          <div>
            {{ seats }}
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
  margin: 1rem;
}

#price-info {
  padding: 0;
  margin: 0;
}

.info-box {
  background-color: rgba(187, 222, 251, .3);
  border: 1px solid lightblue;
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

#total {
  font-weight: 500;;
}

#promo {

}

.red-text {
  color: red;
}

</style>