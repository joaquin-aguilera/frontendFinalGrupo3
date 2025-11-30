# ================================================
# Dockerfile - Frontend Búsqueda y Descubrimiento
# Grupo 3 - Pulga Shop
# Puerto: 80 (interno) -> 5620 (externo)
# ================================================

# Etapa de construcción
FROM node:20 AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Variables de entorno para build (se pueden sobrescribir)
ARG VITE_API_URL=http://localhost:5610
ARG VITE_AUTH_URL=http://localhost:3000
ARG VITE_PUBLICACIONES_URL=http://localhost:4040

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_PUBLICACIONES_URL=$VITE_PUBLICACIONES_URL

# Construir aplicación para producción
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar archivos construidos a Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx para SPA (manejo de rutas)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponer puerto 80 para Nginx
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
