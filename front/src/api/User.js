import Vue from 'vue';

const baseUrl = '/api/';
const create = (body) => Vue.http.post(`${baseUrl}users`, body);
const read = (id) => Vue.http.get(`${baseUrl}users/${id}`);
const update = (id, body) => Vue.http.patch(`${baseUrl}users/${id}`, body);
// If you're over the CRUD, it generally means you need another model. As explained in the backend description, it's a choice for a POC
const login = (email , password) => Vue.http.post(`${baseUrl}auth`, { email, password });
export default {
  create,
  read,
  update,
  login,
};
