import React from "react";
import { Box, Container, Typography, Stack, Link, TextField, Button, Grid } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#22c55e",
        color: "white",
        py: 6,
        mt: 12,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          {/* Exclusivo */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                Exclusivo
              </Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                Suscribirse
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '200px' }}>
                Obtén 10% de descuento en tu primer pedido
              </Typography>
              <Box sx={{ display: 'flex', minWidth: '200px' }}>
                <TextField
                  placeholder="Ingresa tu email"
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      borderRadius: '4px 0 0 4px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.6)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.6)',
                      },
                      backgroundColor: 'transparent',
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  sx={{
                    minWidth: '40px',
                    borderRadius: '0 4px 4px 0',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderLeft: 'none',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  →
                </Button>
              </Box>
            </Stack>
          </Grid>

          {/* Soporte */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Stack spacing={2} sx={{ minWidth: '220px' }}>
              <Typography variant="h6" fontWeight={700}>
                Soporte
              </Typography>
              <Stack spacing={1} sx={{ opacity: 0.9 }}>
                <Typography variant="body1" sx={{ maxWidth: '200px' }}>
                  Calle Principal 123, Ciudad, CP 12345, España.
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>soporte@pulgashop.com</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>+34-900-123-456</Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Cuenta */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Stack spacing={2} sx={{ minWidth: '200px' }}>
              <Typography variant="h6" fontWeight={700}>
                Cuenta
              </Typography>
              <Stack spacing={1}>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Mi Cuenta
                </Link>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Iniciar Sesión / Registro
                </Link>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Carrito
                </Link>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Lista de Deseos
                </Link>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Tienda
                </Link>
              </Stack>
            </Stack>
          </Grid>

          {/* Enlaces Rápidos */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Stack spacing={2} sx={{ minWidth: '180px' }}>
              <Typography variant="h6" fontWeight={700}>
                Enlaces Rápidos
              </Typography>
              <Stack spacing={1}>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Política de Privacidad
                </Link>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Términos de Uso
                </Link>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Preguntas Frecuentes
                </Link>
                <Link href="#" sx={{ color: 'white', textDecoration: 'none', fontSize: '1rem', opacity: 0.9, whiteSpace: 'nowrap', '&:hover': { opacity: 1 } }}>
                  Contacto
                </Link>
              </Stack>
            </Stack>
          </Grid>

          {/* Descargar App */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Stack spacing={2} sx={{ minWidth: '250px' }}>
              <Typography variant="h6" fontWeight={700}>
                Descargar App
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, whiteSpace: 'nowrap' }}>
                Ahorra €3 solo para nuevos usuarios de la app
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Box sx={{ width: 48, height: 48, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 1 }} />
                </Box>
                <Stack spacing={0.5}>
                  <Box sx={{ width: 96, height: 32, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2">Google Play</Typography>
                  </Box>
                  <Box sx={{ width: 96, height: 32, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2">App Store</Typography>
                  </Box>
                </Stack>
              </Box>
              <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <Link href="#" sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <Facebook fontSize="small" />
                </Link>
                <Link href="#" sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <Twitter fontSize="small" />
                </Link>
                <Link href="#" sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <Instagram fontSize="small" />
                </Link>
                <Link href="#" sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <LinkedIn fontSize="small" />
                </Link>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
