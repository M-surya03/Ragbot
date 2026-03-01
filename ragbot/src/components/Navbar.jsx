import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        backdropFilter: "blur(12px)",
        background: "rgba(11,17,32,0.7)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
      elevation={0}
    >
      <Toolbar>
        <SmartToyIcon sx={{ mr: 1, color: "#4f8cff" }} />

        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          AI Academic Portal
        </Typography>

        {isAuthenticated() ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
