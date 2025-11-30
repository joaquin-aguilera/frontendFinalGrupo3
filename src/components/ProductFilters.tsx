import React from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FilterState, Sugerencia } from "../types";

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onSearch: (value: string) => void;
  onSearchInput: (texto: string) => void;
  onSearchFocus?: () => void;
  sugerencias: Sugerencia[];
  onSugerenciaClick: (sugerencia: Sugerencia) => void;
  onClearFilters?: () => void;
  onDeleteHistoryItem?: (id: string) => void;
  onClearAllHistory?: () => void;
}

// Categorías según API real
const categorias = [
  "ELECTRONICA",
  "ROPA",
  "CALZADO",
  "HOGAR",
  "JUGUETES",
  "DEPORTES",
  "LIBROS",
  "ALIMENTOS",
  "BELLEZA",
  "OFICINA",
  "AUTOMOTRIZ",
  "MASCOTAS",
  "GENERAL",
];

// Condiciones según API real
const condiciones = ["NUEVO", "USADO", "REACONDICIONADO"];
const rangosPrecios = [
    { label: "Hasta $5.000", value: "hasta 5000" },
    { label: "$5.000 - $10.000", value: "entre 5000 - 10000" },
    { label: "$10.000 - $25.000", value: "entre 10000 - 25000" },
    { label: "$25.000 - $50.000", value: "entre 25000 - 50000" },
    { label: "$50.000 - $100.000", value: "entre 50000 - 100000" },
    { label: "$100.000 - $300.000", value: "entre 100000 - 300000" },
    { label: "$300.000 - $500.000", value: "entre 300000 - 500000" },
    { label: "Más de $500.000", value: "mas de 500000" },
  ];const ordenamientoOpciones = [
  { label: "Menor a Mayor", value: "precio-asc" },
  { label: "Mayor a Menor", value: "precio-desc" },
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onSearchInput,
  onSearchFocus,
  sugerencias,
  onSugerenciaClick,
  onClearFilters,
  onDeleteHistoryItem,
  onClearAllHistory,
}) => {
  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const valor = e.target.value;
    onSearch(valor);
    onSearchInput(valor);
  };

  const handleSugerenciaClick = (sugerencia: Sugerencia) => {
    onSearch(sugerencia.texto);
    if (sugerencia.tipo === "historial" && sugerencia.filtros) {
      Object.entries(sugerencia.filtros).forEach(([key, value]) => {
        if (value && key !== "search") {
          onFilterChange(key as keyof FilterState, value);
        }
      });
    }
    onSugerenciaClick(sugerencia);
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 3,
      }}
    >
      {/* Barra de búsqueda principal */}
      <Box sx={{ position: "relative" }} className="search-input-container">
        <TextField
          fullWidth
          placeholder="¿Qué producto buscas?"
          value={filters.search}
          onChange={handleSearchInputChange}
          onFocus={onSearchFocus}
          variant="outlined"
          size="medium"
          inputProps={{
            "data-lpignore": true,
            "data-form-type": "other",
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1.5, color: "primary.main" }} />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#fff",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              },
              "&.Mui-focused": {
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              },
            },
            "& .MuiOutlinedInput-input": {
              padding: "12px 14px",
              fontSize: "0.95rem",
            },
          }}
        />

        {sugerencias.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 320,
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              borderRadius: "8px",
            }}
          >
            <List sx={{ p: 0 }}>
              {sugerencias
                .filter((s) => s.tipo === "historial")
                .slice(0, 3)
                .map((sugerencia, index) => (
                  <ListItemButton
                    key={`historial-${index}`}
                    onClick={() => handleSugerenciaClick(sugerencia)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <HistoryIcon fontSize="small" sx={{ color: "info.main" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={sugerencia.texto}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 500,
                      }}
                    />
                    {sugerencia.id && onDeleteHistoryItem && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistoryItem(sugerencia.id!);
                        }}
                        sx={{
                          ml: 1,
                          opacity: 0.6,
                          "&:hover": {
                            opacity: 1,
                            backgroundColor: "error.light",
                            color: "error.contrastText",
                          },
                        }}
                        title="Eliminar del historial"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ListItemButton>
                ))}

              {sugerencias
                .filter((s) => s.tipo === "coincidencia")
                .slice(0, 3)
                .map((sugerencia, index) => (
                  <ListItemButton
                    key={`coincidencia-${index}`}
                    onClick={() => handleSugerenciaClick(sugerencia)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <SearchIcon
                        fontSize="small"
                        sx={{ color: "success.main" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={sugerencia.texto}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Filtros */}
      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          p: 2.5,
          border: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <FilterAltIcon sx={{ fontSize: "1.2rem", color: "#22c55e" }} />
          <Box component="span" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
            Filtrar por:
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Categoría */}
          <Grid item xs={12} sm={6} md={3}>
            <Select
              fullWidth
              value={filters.categoria || ""}
              onChange={(e) => onFilterChange("categoria", e.target.value)}
              displayEmpty
              size="small"
              sx={{
                borderRadius: "6px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d0d0d0",
                },
              }}
            >
              <MenuItem value="" sx={{ fontStyle: "italic", color: "text.disabled" }}>
                Todas las categorías
              </MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Precio */}
          <Grid item xs={12} sm={6} md={3}>
            <Select
              fullWidth
              value={filters.precio || ""}
              onChange={(e) => onFilterChange("precio", e.target.value)}
              displayEmpty
              size="small"
              sx={{
                borderRadius: "6px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d0d0d0",
                },
              }}
            >
              <MenuItem value="" sx={{ fontStyle: "italic", color: "text.disabled" }}>
                Todos los precios
              </MenuItem>
              {rangosPrecios.map((rango) => (
                <MenuItem key={rango.value} value={rango.value}>
                  {rango.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Condición */}
          <Grid item xs={12} sm={6} md={3}>
            <Select
              fullWidth
              value={filters.condicion || ""}
              onChange={(e) => onFilterChange("condicion", e.target.value)}
              displayEmpty
              size="small"
              sx={{
                borderRadius: "6px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d0d0d0",
                },
              }}
            >
              <MenuItem value="" sx={{ fontStyle: "italic", color: "text.disabled" }}>
                Todas las condiciones
              </MenuItem>
              {condiciones.map((cond) => (
                <MenuItem key={cond} value={cond}>
                  {cond}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Ordenamiento */}
          <Grid item xs={12} sm={6} md={3}>
            <Select
              fullWidth
              value={filters.ordenPrecio || ""}
              onChange={(e) => onFilterChange("ordenPrecio", e.target.value)}
              displayEmpty
              size="small"
              sx={{
                borderRadius: "6px",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d0d0d0",
                },
              }}
            >
              <MenuItem value="" sx={{ fontStyle: "italic", color: "text.disabled" }}>
                Ordenar por precio
              </MenuItem>
              {ordenamientoOpciones.map((orden) => (
                <MenuItem key={orden.value} value={orden.value}>
                  {orden.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        {/* Botones limpiar */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {onClearAllHistory && (
            <Button
              variant="text"
              size="small"
              startIcon={<DeleteSweepIcon />}
              onClick={onClearAllHistory}
              sx={{
                color: "error.main",
                textTransform: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  backgroundColor: "rgba(211,47,47,0.08)",
                },
              }}
            >
              Borrar historial
            </Button>
          )}
          <Button
            variant="text"
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontSize: "0.85rem",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            Limpiar filtros
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductFilters;