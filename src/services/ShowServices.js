import apiClient from "./services";

export default {
  getShows() {
    return apiClient.get("shows");
  },
};
