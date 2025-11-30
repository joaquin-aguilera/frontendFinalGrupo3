import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import LOGO1 from "../assets/LOGO1.png";

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#22c55e",
        boxShadow: 2,
        top: 0,
        zIndex: 1100,
        width: "100%",
        maxWidth: "100vw",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
        }}
      >
        {/* Logo y Nombre - Clickeable */}
        <Box
          onClick={onLogoClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          <Box
            component="img"
            src={LOGO1}
            alt="Pulga Shop Logo"
            sx={{
              height: 55,
              width: "auto",
              objectFit: "contain",
            }}
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >

          </Typography>
        </Box>


      </Toolbar>
    </AppBar>
  );
};

export default Header;
