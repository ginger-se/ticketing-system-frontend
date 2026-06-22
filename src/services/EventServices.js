import apiClient from "./services";

export default {
  getEvents() {
    return apiClient.get("events");
  },
  getEventsForToday(){
    return apiClient.get("events/today")
  },
  getEventsByShowId(showId) {
    return apiClient.get("events?showId=" + showId);
  },
  getEvent(id) {
    return apiClient.get("events/" + id);
  },
   addEvent(event) {
    return apiClient.post("events", event);
  },
  updateEvent(eventId, event) {
    return apiClient.put("events/" + eventId, event);
  },
  cancelEvent(eventId) {
    return apiClient.put("events/" + eventId + "/cancel");
  },

  deleteShow(eventId) {
    return apiClient.delete("events/" + eventId);
  },
};
