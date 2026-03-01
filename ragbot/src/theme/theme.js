import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366F1" },   
    secondary: { main: "#8B5CF6" },   
    background: {
      default: "#0B1120",            
      paper: "#111827",
    },
    text: {
      primary: "#E5E7EB",
      secondary: "#C7D2FE",         
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h3: { fontWeight: 700, letterSpacing: 0.5 },
    h4: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
});

export default theme;
