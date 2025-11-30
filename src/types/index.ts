export interface Product {
  id?: string;              // ID de la publicación
  id_producto: string;      // ID del producto (puede venir de API o dummy)
  titulo?: string;          // Título de la publicación
  nombre?: string;          // Nombre del producto (alternativo a titulo)
  precio: number;
  categoria: string;
  condicion: string;
  descripcion?: string;
  marca?: string;
  stock?: number;           // Stock disponible
  fecha_creacion?: string;
  imagen?: string;
  multimedia?: Array<{     // Array de imágenes
    url: string;
    orden: number;
  }>;
}

export interface FilterState {
  search: string;
  precio?: string;
  categoria?: string;
  condicion?: string;
  ordenPrecio?: string;
}

export interface Sugerencia {
  texto: string;
  tipo: 'historial' | 'coincidencia';
  filtros?: Partial<FilterState>;
  id?: string;  // ID para poder borrar del historial
}