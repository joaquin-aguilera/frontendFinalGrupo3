/**
 * Configuración central de URLs de la aplicación
 */

// En desarrollo, usamos el proxy de Vite (rutas relativas)
// En producción, usamos las variables de entorno
const isDevelopment = import.meta.env.DEV;

export const API_URL = isDevelopment ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5610');
export const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:3000';

// URL del frontend de publicaciones (otro equipo)
export const PUBLICACIONES_URL = import.meta.env.VITE_PUBLICACIONES_URL || 'http://localhost:4040';

/**
 * Endpoints de la API de búsqueda
 */
export const API_ENDPOINTS = {
  // Productos y búsquedas
  search: `${API_URL}/api/search/products`,
  randomProducts: `${API_URL}/api/search/products/random`,
  popularProducts: `${API_URL}/api/search/popular-products`,
  suggestions: `${API_URL}/api/search/suggestions`,
  
  // Historial
  history: `${API_URL}/api/search/history`,
  deleteHistory: (id: string) => `${API_URL}/api/search/history/${id}`,
  
  // Clicks
  click: `${API_URL}/api/search/click`,
  
  // Categorías
  categories: `${API_URL}/api/categories`,
  categoryImage: (category: string) => `${API_URL}/api/images/category/${encodeURIComponent(category)}`,
  categoryProducts: (category: string) => `${API_URL}/api/categories/${encodeURIComponent(category)}/products`,
  
  // Analítica
  topProducts: `${API_URL}/api/analytics/top-products`,
  stats: `${API_URL}/api/analytics/stats`,
  topTerms: `${API_URL}/api/analytics/top-terms`,
  trends: `${API_URL}/api/analytics/trends`,
} as const;

/**
 * Endpoints de autenticación
 */
export const AUTH_ENDPOINTS = {
  login: `${AUTH_URL}/api/auth/login`,
  register: `${AUTH_URL}/api/auth/register`,
  me: `${AUTH_URL}/api/auth/me`,
  logout: `${AUTH_URL}/api/auth/logout`,
} as const;

/**
 * URLs del frontend de publicaciones (equipo externo)
 * Al hacer click en un producto, redirigimos a esta URL
 */
export const PUBLICACIONES_ENDPOINTS = {
  // Redirige al detalle de una publicación por su ID
  verPublicacion: (idPublicacion: string) => `${PUBLICACIONES_URL}/publicaciones/${idPublicacion}`,
} as const;
