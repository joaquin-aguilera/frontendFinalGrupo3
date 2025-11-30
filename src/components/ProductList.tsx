import { useState, FormEvent, useEffect, forwardRef, useImperativeHandle, useMemo } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { API_ENDPOINTS, PUBLICACIONES_ENDPOINTS } from "../config/api";
import ProductFilters from "./ProductFilters";
import CategoriesPage from "./CategoriesPage";
import PopularProducts from "./PopularProducts";
import ErrorAlert from "./ErrorAlert";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Product, FilterState, Sugerencia } from "../types";

/**
 * Componente de paginación con bloques de 10 páginas
 * Lógica: Muestra páginas del 1-10, luego 11-20, 21-30, etc.
 * - Botón Primera página (<<)
 * - Botón Bloque anterior (<< 10)
 * - Botón Página anterior (<)
 * - Números de página del bloque actual
 * - Botón Página siguiente (>)
 * - Botón Bloque siguiente (>> 10)
 * - Botón Última página (>>)
 */
interface PaginationBlockProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  blockSize?: number;
}

const PaginationBlock: React.FC<PaginationBlockProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  blockSize = 10
}) => {
  // Calcular el bloque actual (1-10 es bloque 0, 11-20 es bloque 1, etc.)
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  
  // Calcular el rango de páginas del bloque actual
  const blockStart = currentBlock * blockSize + 1;
  const blockEnd = Math.min(blockStart + blockSize - 1, totalPages);
  
  // Generar array de páginas del bloque actual
  const pages = useMemo(() => {
    const arr: number[] = [];
    for (let i = blockStart; i <= blockEnd; i++) {
      arr.push(i);
    }
    return arr;
  }, [blockStart, blockEnd]);

  // Calcular si hay bloques anteriores/siguientes
  const hasPrevBlock = currentBlock > 0;
  const hasNextBlock = blockEnd < totalPages;
  
  // Primera página del bloque anterior
  const prevBlockPage = hasPrevBlock ? (currentBlock - 1) * blockSize + 1 : 1;
  // Primera página del bloque siguiente
  const nextBlockPage = hasNextBlock ? (currentBlock + 1) * blockSize + 1 : totalPages;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 0.5,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      {/* Botón Primera Página */}
      <IconButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        size="small"
        title="Primera página"
        sx={{
          borderRadius: '8px',
          '&:hover': { backgroundColor: 'primary.light', color: 'white' }
        }}
      >
        <FirstPageIcon />
      </IconButton>

      {/* Botón Bloque Anterior (-10) */}
      <IconButton
        onClick={() => onPageChange(prevBlockPage)}
        disabled={!hasPrevBlock}
        size="small"
        title={`Ir a página ${prevBlockPage}`}
        sx={{
          borderRadius: '8px',
          '&:hover': { backgroundColor: 'primary.light', color: 'white' }
        }}
      >
        <SkipPreviousIcon />
      </IconButton>

      {/* Botón Página Anterior */}
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="small"
        title="Página anterior"
        sx={{
          borderRadius: '8px',
          '&:hover': { backgroundColor: 'primary.light', color: 'white' }
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Números de Página del Bloque Actual */}
      <Box sx={{ display: 'flex', gap: 0.5, mx: 1 }}>
        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "contained" : "outlined"}
            size="small"
            onClick={() => onPageChange(page)}
            sx={{
              minWidth: '36px',
              height: '36px',
              borderRadius: '8px',
              fontWeight: page === currentPage ? 700 : 400,
            }}
          >
            {page}
          </Button>
        ))}
      </Box>

      {/* Botón Página Siguiente */}
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="small"
        title="Página siguiente"
        sx={{
          borderRadius: '8px',
          '&:hover': { backgroundColor: 'primary.light', color: 'white' }
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* Botón Bloque Siguiente (+10) */}
      <IconButton
        onClick={() => onPageChange(nextBlockPage)}
        disabled={!hasNextBlock}
        size="small"
        title={`Ir a página ${nextBlockPage}`}
        sx={{
          borderRadius: '8px',
          '&:hover': { backgroundColor: 'primary.light', color: 'white' }
        }}
      >
        <SkipNextIcon />
      </IconButton>

      {/* Botón Última Página */}
      <IconButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        size="small"
        title="Última página"
        sx={{
          borderRadius: '8px',
          '&:hover': { backgroundColor: 'primary.light', color: 'white' }
        }}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
};

const ProductList = forwardRef<{ handleBackToCategories: () => void }>((_props, ref) => {
  const location = useLocation();
  const showSearch = (location.state as { showSearch?: boolean })?.showSearch;
  const [showCategories, setShowCategories] = useState(!showSearch);
  const [categorySelected, setCategorySelected] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    precio: "",
    categoria: "",
    condicion: "",
    ordenPrecio: "",
  });

  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 20;

  // Exponer el método handleBackToCategories al componente padre
  useImperativeHandle(ref, () => ({
    handleBackToCategories,
  }));

  // Cargar todos los productos al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      try {
        console.log('🔍 Cargando todos los productos iniciales...');
        const response = await axios.get(
          API_ENDPOINTS.search,
          { params: { page: currentPage, pageSize } }
        );
        // El backend retorna { productos: [...], metadata: {...}, sessionId: '...' }
        const productosData = response.data.productos || response.data;
        const metadata = response.data.metadata;
        console.log(`✅ ${productosData.length} productos cargados`);
        setProductos(productosData);
        
        // Actualizar paginación si viene metadata
        if (metadata) {
          setTotalPages(metadata.totalPages || 1);
          setTotalProducts(metadata.total || productosData.length);
        }
      } catch (err) {
        setError("Error al cargar los productos");
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, [currentPage]);

  // Ejecutar búsqueda cuando cambian los filtros (excepto search que se maneja con el botón)
  useEffect(() => {
    // Solo ejecutar si hay algún filtro activo (no search)
    if (filters.precio || filters.categoria || filters.condicion || filters.ordenPrecio) {
      buscarProductos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.precio, filters.categoria, filters.condicion, filters.ordenPrecio]);

  // Buscar productos cuando se selecciona una categoría
  useEffect(() => {
    if (categorySelected && filters.categoria) {
      buscarProductos();
      setCategorySelected(false);
    }
  }, [categorySelected]);

  const buscarProductos = async (e?: FormEvent, page: number = 1) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    setSugerencias([]);

    try {
      // Si no hay filtros, mostrar todos los productos
      if (
        !filters.search.trim() &&
        !filters.precio &&
        !filters.categoria &&
        !filters.condicion &&
        !filters.ordenPrecio
      ) {
        const response = await axios.get(
          API_ENDPOINTS.search,
          { params: { page, pageSize } }
        );
        const productosData = response.data.productos || response.data;
        const metadata = response.data.metadata;
        setProductos(productosData);
        if (metadata) {
          setTotalPages(metadata.totalPages || 1);
          setTotalProducts(metadata.total || productosData.length);
          setCurrentPage(page);
        }
        return;
      }

      // Manejo especial para la categoría "SORPRENDEME"
      if (filters.categoria === "SORPRENDEME") {
        const response = await axios.get(
          API_ENDPOINTS.randomProducts,
          {
            params: { limit: 20 }
          }
        );
        
        const responseData = response.data;
        const productos = responseData.productos || responseData;
        setProductos(productos);
        setTotalPages(1);
        setTotalProducts(productos.length);
        return;
      }

      const searchParams: Record<string, string | number> = {
        page,
        pageSize
      };

      if (filters.search.trim()) {
        searchParams.busqueda = filters.search.trim();
      }

      if (filters.precio && filters.precio !== "")
        searchParams.precio = filters.precio;
      if (filters.categoria && filters.categoria !== "")
        searchParams.categoria = filters.categoria;
      if (filters.condicion && filters.condicion !== "")
        searchParams.condicion = filters.condicion;
      if (filters.ordenPrecio && filters.ordenPrecio !== "")
        searchParams.ordenar = filters.ordenPrecio;

      const response = await axios.get(
        API_ENDPOINTS.search,
        {
          params: searchParams,
        }
      );

      // El backend ahora retorna { productos, metadata: { searchId, total } }
      const responseData = response.data as any;
      const productos = responseData.productos || responseData;
      const metadata = responseData.metadata;

      setProductos(productos);

      // Actualizar paginación
      if (metadata) {
        setTotalPages(metadata.totalPages || 1);
        setTotalProducts(metadata.total || productos.length);
        setCurrentPage(page);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Error al realizar la búsqueda"
        );
      } else {
        setError("Error al realizar la búsqueda");
        console.error("Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar de página
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      buscarProductos(undefined, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    if (!value.trim()) {
      setSugerencias([]);
    }
  };

  const handleSelectCategory = (category: string) => {
    // Si es "TODO", no establecer filtro de categoría (mostrar todos)
    if (category === "TODO") {
      setFilters((prev) => ({ ...prev, categoria: "" }));
    } else {
      setFilters((prev) => ({ ...prev, categoria: category }));
    }
    setShowCategories(false);
    setCategorySelected(true);
  };

  const handleBackToCategories = () => {
    setShowCategories(true);
    handleClearFilters();
  };

  // Helper para obtener el nombre del producto (titulo o nombre)
  const getProductName = (producto: Product): string => {
    return producto.titulo || producto.nombre || 'Producto sin nombre';
  };

  /**
   * Maneja el click en un producto
   * 1. Registra el click en nuestro backend (para analíticas)
   * 2. Redirige al frontend de publicaciones (equipo externo)
   */
  const handleProductClick = async (producto: Product) => {
    console.log("🔍 Click en producto:", producto.id, getProductName(producto));
    
    // Registrar el click para analíticas
    try {
      await axios.post(API_ENDPOINTS.click, {
        id_producto: producto.id_producto,
        nombre: getProductName(producto),
      });
      console.log(`✅ Click registrado: ${getProductName(producto)}`);
    } catch (err) {
      console.error("❌ Error al registrar click:", err);
      // No bloqueamos la redirección si falla el registro
    }
    
    // Redirigir al frontend de publicaciones (equipo externo)
    // Usamos el ID de la publicación (producto.id), no el id_producto
    const urlPublicacion = PUBLICACIONES_ENDPOINTS.verPublicacion(producto.id);
    console.log("🚀 Redirigiendo a publicaciones:", urlPublicacion);
    window.location.href = urlPublicacion;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector(
        ".search-input-container"
      );
      if (
        searchContainer &&
        !searchContainer.contains(event.target as Node)
      ) {
        setSugerencias([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const obtenerSugerencias = async (texto: string) => {
    try {
      // Llamar al API incluso sin texto (para mostrar historial)
      const response = await axios.get<Sugerencia[]>(
        `${API_ENDPOINTS.suggestions}?texto=${encodeURIComponent(texto.trim())}`
      );
      setSugerencias(response.data);
    } catch (err) {
      console.error("Error al obtener sugerencias:", err);
      setSugerencias([]);
    }
  };

  // Función para mostrar historial al hacer focus en el input
  const handleSearchFocus = async () => {
    // Si no hay sugerencias visibles, cargar el historial
    if (sugerencias.length === 0) {
      await obtenerSugerencias(filters.search);
    }
  };

  const handleSugerenciaClick = async (sugerencia: Sugerencia) => {
    if (sugerencia.tipo === "historial" && sugerencia.filtros) {
      setFilters((prev) => ({
        ...prev,
        ...sugerencia.filtros,
        search: sugerencia.texto,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        search: sugerencia.texto,
      }));
    }
    setSugerencias([]);

    await buscarProductos();
  };

  const handleClearFilters = async () => {
    setFilters({
      search: "",
      precio: "",
      categoria: "",
      condicion: "",
      ordenPrecio: "",
    });
    setSugerencias([]);
    
    // Cargar todos los productos
    setLoading(true);
    try {
      const response = await axios.get<Product[]>(
        API_ENDPOINTS.search
      );
      setProductos(response.data);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un elemento específico del historial
  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await axios.delete(API_ENDPOINTS.deleteHistory(id));
      // Remover de las sugerencias actuales
      setSugerencias(prev => prev.filter(s => s.id !== id));
      console.log(`✅ Elemento del historial eliminado: ${id}`);
    } catch (err) {
      console.error("Error al eliminar del historial:", err);
      setError("Error al eliminar del historial");
    }
  };

  // Borrar todo el historial de navegación
  const handleClearAllHistory = async () => {
    try {
      await axios.delete(API_ENDPOINTS.history);
      // Limpiar sugerencias de historial
      setSugerencias(prev => prev.filter(s => s.tipo !== 'historial'));
      console.log("✅ Todo el historial eliminado");
    } catch (err) {
      console.error("Error al limpiar historial:", err);
      setError("Error al limpiar el historial");
    }
  };

  const getCondicionColor = (
    condicion: string
  ): "success" | "warning" | "error" | "info" | "default" | undefined => {
    switch (condicion.toUpperCase()) {
      case "NUEVO":
        return "success";
      case "USADO":
        return "warning";
      case "REACONDICIONADO":
        return "info";
      default:
        return "default";
    }
  };

  const getCondicionLabel = (condicion: string): string => {
    switch (condicion.toUpperCase()) {
      case "NUEVO":
        return "✓ Nuevo";
      case "USADO":
        return "↻ Usado";
      case "REACONDICIONADO":
        return "⚙ Recondicionado";
      default:
        return condicion;
    }
  };

  const formatearPrecio = (precio: number): string => {
    // Si el precio está en centavos (>= 100), convertir a dólares
    const precioEnDolares = precio >= 100 ? precio / 100 : precio;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precioEnDolares);
  };

  return (
    <>
      {showCategories ? (
        <>
          <CategoriesPage onSelectCategory={handleSelectCategory} />
          <PopularProducts onProductClick={handleProductClick} />
        </>
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box component="form" onSubmit={buscarProductos} sx={{ mb: 4 }}>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              onSearchInput={obtenerSugerencias}
              onSearchFocus={handleSearchFocus}
              sugerencias={sugerencias}
              onSugerenciaClick={handleSugerenciaClick}
              onClearFilters={handleClearFilters}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onClearAllHistory={handleClearAllHistory}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              type="submit"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              {loading ? "Buscando..." : "Buscar Productos"}
            </Button>
          </Box>

          {error && (
            <ErrorAlert
              message={error}
              onClose={() => setError("")}
              sx={{ mb: 3 }}
            />
          )}

          {loading && !productos.length ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <CircularProgress />
                <Typography variant="body1" color="text.secondary">
                  Cargando productos...
                </Typography>
              </Stack>
            </Box>
          ) : productos.length > 0 ? (
            <>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "text.secondary", fontWeight: 500 }}
              >
                {productos.length} producto{productos.length !== 1 ? "s" : ""}{" "}
                encontrado{productos.length !== 1 ? "s" : ""}
              </Typography>
              <Grid container spacing={3}>
                {productos.map((producto) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={`${producto.id_producto}-${producto.sku}`}
                  >
                    <Card
                      onClick={() => handleProductClick(producto)}
                      sx={{
                        position: "relative",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                          transform: "translateY(-8px)",
                        },
                        overflow: "hidden",
                      }}
                    >
                      {/* Imagen del producto */}
                      {producto.imagen ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={producto.imagen}
                          alt={getProductName(producto)}
                          sx={{
                            objectFit: "cover",
                            backgroundColor: "#f5f5f5",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 200,
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <InventoryIcon
                            sx={{ fontSize: 60, color: "#ccc" }}
                          />
                        </Box>
                      )}

                      {/* Badge de condición */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 1,
                        }}
                      >
                        <Chip
                          label={getCondicionLabel(producto.condicion)}
                          size="small"
                          color={getCondicionColor(producto.condicion)}
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        {/* Marca */}
                        {producto.marca && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "text.secondary",
                              mb: 0.5,
                              fontWeight: 500,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {producto.marca}
                          </Typography>
                        )}

                        {/* Nombre del producto */}
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4,
                            color: "#1a1a1a",
                          }}
                        >
                          {getProductName(producto)}
                        </Typography>

                        {/* Descripción */}
                        {producto.descripcion && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              fontSize: "0.85rem",
                              lineHeight: 1.3,
                            }}
                          >
                            {producto.descripcion}
                          </Typography>
                        )}

                        {/* Precio */}
                        <Typography
                          variant="h5"
                          sx={{
                            color: "primary.main",
                            fontWeight: 700,
                            mb: 2,
                            fontSize: "1.5rem",
                          }}
                        >
                          {formatearPrecio(producto.precio)}
                        </Typography>

                        {/* Stock e Información */}
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          {/* Categoría */}
                          <Chip
                            label={`📦 ${producto.categoria}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.8rem",
                              height: "auto",
                              "& .MuiChip-label": { px: 1, py: 0.5 },
                            }}
                          />

                          {/* Stock */}
                          {producto.stock !== undefined && (
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <LocalShippingIcon
                                sx={{
                                  fontSize: "1rem",
                                  color:
                                    producto.stock > 0
                                      ? "success.main"
                                      : "error.main",
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 500,
                                  color:
                                    producto.stock > 0
                                      ? "success.main"
                                      : "error.main",
                                }}
                              >
                                {producto.stock > 0
                                  ? `${producto.stock} disponible${producto.stock !== 1 ? "s" : ""}`
                                  : "Sin stock"}
                              </Typography>
                            </Stack>
                          )}

                          {/* SKU */}
                          {producto.sku && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.75rem",
                                color: "text.disabled",
                              }}
                            >
                              SKU: {producto.sku}
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Paginación con bloques de 10 */}
              {totalPages > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  mt: 4,
                  mb: 2,
                  gap: 2
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalProducts)} de {totalProducts} productos
                  </Typography>
                  
                  {/* Componente de paginación personalizado con bloques de 10 */}
                  <PaginationBlock
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              )}
            </>
          ) : (
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              <InventoryIcon
                sx={{
                  fontSize: 64,
                  color: "text.disabled",
                  mb: 2,
                }}
              />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                No se encontraron productos
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Intenta con otros términos de búsqueda o modifica los filtros
              </Typography>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ borderRadius: "6px" }}
              >
                Limpiar Filtros
              </Button>
            </Paper>
          )}
        </Container>
      )}
    </>
  );
});

ProductList.displayName = 'ProductList';

export default ProductList;

