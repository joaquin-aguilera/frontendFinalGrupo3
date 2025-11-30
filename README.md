# Frontend - Microservicio de Búsqueda

**Encargados:** Angel Pino, Thean Orlandi

## Ejecución

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 5620)
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Con Docker

```bash
docker build -t busqueda-frontend .
docker run -p 5620:5620 busqueda-frontend
```

## Estructura del Directorio

```
frontend/
├── src/
│   ├── main.tsx              # Punto de entrada
│   ├── App.tsx               # Componente principal
│   ├── components/           # Componentes reutilizables
│   │   ├── SearchBar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Filters.tsx
│   │   └── ...
│   ├── views/                # Vistas/páginas
│   │   ├── HomePage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── ...
│   ├── routes/               # Configuración de rutas
│   ├── layouts/              # Layouts de página
│   ├── style/                # Estilos globales
│   ├── types/                # Tipos TypeScript
│   └── assets/               # Recursos estáticos
├── public/                   # Archivos públicos
├── Dockerfile
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:5610
VITE_AUTH_URL=http://localhost:3000
```

## Integraciones

### Backend de Búsqueda (Puerto 5610)

El frontend consume los siguientes endpoints:

- `GET /api/search/products` - Búsqueda de productos
- `GET /api/search/popular-products` - Productos populares
- `GET /api/search/suggestions` - Sugerencias de búsqueda
- `GET /api/search/history` - Historial del usuario
- `POST /api/search/click` - Registrar click en producto
- `DELETE /api/search/history` - Eliminar historial
- `GET /api/categories` - Listar categorías
- `GET /api/images/category/:category` - Imágenes de categorías

### Servicio de Autenticación (Puerto 3000)

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/validate` - Validar token JWT

## Características

- **Búsqueda Inteligente:** Filtros por texto, precio, categoría y condición
- **Productos Populares:** Basados en clicks de usuarios
- **Historial de Búsquedas:** Para usuarios autenticados
- **Sugerencias:** Autocompletado basado en historial
- **Responsive:** Diseño adaptable a móviles y tablets
- **Optimización de Imágenes:** Carga de imágenes WebP optimizadas

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter de código
