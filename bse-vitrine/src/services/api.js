import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Produits
export const getProducts    = (params) => API.get('/products', { params });
export const getProductById = (id)     => API.get(`/products/${id}`);

// Catégories
export const getCategories    = ()   => API.get('/categories');
export const getCategoryById  = (id) => API.get(`/categories/${id}`);

// Projets
export const getProjects    = ()   => API.get('/projects');
export const getProjectById = (id) => API.get(`/projects/${id}`);

// Contenus du site
export const getSiteContent = () => API.get('/site-content');

// Messages / formulaire de contact
export const sendMessage = (data) => API.post('/messages', data);

export default API;