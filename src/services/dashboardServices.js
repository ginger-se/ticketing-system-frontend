import api from './services';

export default {
 getStats() {
   return api.get('/dashboard/stats')},
};
