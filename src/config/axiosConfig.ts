import axios from 'axios';

const SESSION_ID_KEY = 'pulga_session_id';

/**
 * Configuración global de axios con manejo de sesión anónima
 * El backend envía X-Session-Id en las respuestas para usuarios no autenticados
 * El frontend debe guardar este ID y enviarlo en todas las peticiones siguientes
 */

// Interceptor de requests: agregar sessionId si existe
axios.interceptors.request.use(
  (config) => {
    // Obtener sessionId guardado
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    
    if (sessionId) {
      config.headers['X-Session-Id'] = sessionId;
    }
    
    // Si hay token de autenticación, agregarlo también
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de responses: guardar sessionId si viene en la respuesta
axios.interceptors.response.use(
  (response) => {
    // Verificar si el backend envió un nuevo sessionId en el header
    const newSessionId = response.headers['x-session-id'];
    
    if (newSessionId) {
      const currentSessionId = localStorage.getItem(SESSION_ID_KEY);
      
      if (newSessionId !== currentSessionId) {
        localStorage.setItem(SESSION_ID_KEY, newSessionId);
        console.log('🆔 SessionId actualizado:', newSessionId);
      }
    }
    
    // También verificar si viene en el body (algunas respuestas lo incluyen)
    if (response.data?.sessionId) {
      const bodySessionId = response.data.sessionId;
      const currentSessionId = localStorage.getItem(SESSION_ID_KEY);
      
      if (bodySessionId !== currentSessionId) {
        localStorage.setItem(SESSION_ID_KEY, bodySessionId);
        console.log('🆔 SessionId actualizado desde body:', bodySessionId);
      }
    }
    
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Obtiene el sessionId actual (para debugging o uso directo)
 */
export const getSessionId = (): string | null => {
  return localStorage.getItem(SESSION_ID_KEY);
};

/**
 * Limpia el sessionId (útil al cerrar sesión o limpiar datos)
 */
export const clearSessionId = (): void => {
  localStorage.removeItem(SESSION_ID_KEY);
  console.log('🗑️ SessionId eliminado');
};

/**
 * Establece manualmente un sessionId (para testing o migración)
 */
export const setSessionId = (sessionId: string): void => {
  localStorage.setItem(SESSION_ID_KEY, sessionId);
  console.log('🆔 SessionId establecido:', sessionId);
};

export default axios;
