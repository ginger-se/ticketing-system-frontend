<script setup>
import { onMounted, ref } from "vue";
import EventServices from "../services/EventServices.js";
import ShowServices from "../services/ShowServices.js";

const events = ref([]);
const shows = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newEvent = ref({
  startTime: "",
  endTime: "",
  capacity: 75,
  status: "Scheduled",
  showId: null,
});
const editEvent = ref({});

onMounted(async () => {
  await getEvents();
  await getShows();
});

async function getEvents() {
  await EventServices.getEvents()
    .then((response) => {
      events.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getShows() {
  await ShowServices.getShows()
    .then((response) => {
      shows.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addEvent() {
  isAdd.value = false;
  await EventServices.addEvent(newEvent.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Event added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getEvents();
}

async function updateEvent() {
  isEdit.value = false;
  await EventServices.updateEvent(editEvent.value.id, editEvent.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Event updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getEvents();
}

async function cancelEvent(event) {
  await EventServices.cancelEvent(event.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Event cancelled successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getEvents();
}

function getShowTitle(showId) {
  const show = shows.value.find((s) => s.id === showId);
  return show ? show.title : "Unknown";
}

function openAdd() {
  newEvent.value = {
    startTime: "",
    endTime: "",
    capacity: 75,
    status: "Scheduled",
    showId: null,
  };
  isAdd.value = true;
}

function openEdit(event) {
  editEvent.value = { ...event };
  isEdit.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function closeEdit() {
  isEdit.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
   <v-btn  variant="text" prepend-icon="mdi-arrow-left"  :to="{ name: 'adminDashboard' }" class="mb-4">
    Back to Dashboard
  </v-btn>
    <v-row align="center" class="mb-4">
      <v-col cols="10">
        <v-card-title class="pl-0 text-h4 font-weight-bold">
          Manage Events
        </v-card-title>
      </v-col>
      <v-col class="d-flex justify-end" cols="2">
        <v-btn color="accent" @click="openAdd()">+ Create Event</v-btn>
      </v-col>
    </v-row>

    <v-card class="rounded-lg elevation-5">
      <v-table>
        <thead>
          <tr>
            <th>Show</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>{{ getShowTitle(event.showId) }}</td>
            <td>{{ new Date(event.startTime).toLocaleString() }}</td>
            <td>{{ new Date(event.endTime).toLocaleString() }}</td>
            <td>{{ event.capacity }}</td>
            <td>
              <v-chip
                :color="event.status === 'Scheduled' ? 'green' : event.status === 'Cancelled' ? 'error' : 'grey'"
                size="small"
              >{{ event.status }}</v-chip>
            </td>
            <td>
              <v-btn
                size="small"
                variant="outlined"
                class="mr-2"
                @click="openEdit(event)"
              >Edit</v-btn>
              <v-btn
                size="small"
                variant="outlined"
                color="error"
                @click="cancelEvent(event)"
              >Cancel</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Add Event Dialog -->
    <v-dialog persistent v-model="isAdd" width="600">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Add Event</v-card-title>
        <v-card-text>
          <v-select
            v-model="newEvent.showId"
            :items="shows"
            item-title="title"
            item-value="id"
            label="Select Show"
            required
          ></v-select>
          <v-text-field
            v-model="newEvent.startTime"
            label="Start Time"
            type="datetime-local"
            required
          ></v-text-field>
          <v-text-field
            v-model="newEvent.endTime"
            label="End Time"
            type="datetime-local"
            required
          ></v-text-field>
          <v-text-field
            v-model.number="newEvent.capacity"
            label="Capacity"
            type="number"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="secondary" @click="closeAdd()">Close</v-btn>
          <v-btn variant="flat" color="primary" @click="addEvent()">Add Event</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Event Dialog -->
    <v-dialog persistent v-model="isEdit" width="600">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Edit Event</v-card-title>
        <v-card-text>
          <v-select
            v-model="editEvent.showId"
            :items="shows"
            item-title="title"
            item-value="id"
            label="Select Show"
            required
          ></v-select>
          <v-text-field
            v-model="editEvent.startTime"
            label="Start Time"
            type="datetime-local"
            required
          ></v-text-field>
          <v-text-field
            v-model="editEvent.endTime"
            label="End Time"
            type="datetime-local"
            required
          ></v-text-field>
          <v-text-field
            v-model.number="editEvent.capacity"
            label="Capacity"
            type="number"
            required
          ></v-text-field>
          <v-select
            v-model="editEvent.status"
            :items="['Scheduled', 'Cancelled', 'Completed']"
            label="Status"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="secondary" @click="closeEdit()">Close</v-btn>
          <v-btn variant="flat" color="primary" @click="updateEvent()">Update Event</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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