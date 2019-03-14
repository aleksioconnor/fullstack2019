import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
  return axios.get('http://localhost:3001/persons');
}

const create = newObject => {
  return axios.post(baseUrl, newObject);
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`);
}

const edit = (id, newObj) => {
  return axios.put(`${baseUrl}/${id}`, newObj)
}

export default {
  create: create,
  remove: remove,
  getAll: getAll,
  edit: edit,
}