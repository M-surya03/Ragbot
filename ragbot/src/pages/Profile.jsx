import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const name = user?.name || "User";
  const email = user?.email || "Not provided";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("chats");
    navigate("/login"); // Change if your login route is different
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 4,
          bgcolor: "#0B1120",
          border: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Avatar */}
        <Box textAlign="center" mb={3}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              mx: "auto",
              mb: 2,
              bgcolor: "#6366F1",
              fontSize: 36,
              boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h5" fontWeight={600}>
            {name}
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, opacity: 0.1 }} />

        {/* Account Info */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PersonOutlineIcon fontSize="small" />
          <Typography fontSize={14}>
            <strong>Name:</strong> {name}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={4}>
          <EmailOutlinedIcon fontSize="small" />
          <Typography fontSize={14}>
            <strong>Email:</strong> {email}
          </Typography>
        </Box>

        {/* Logout Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            py: 1.2,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "#EF4444",
            "&:hover": {
              bgcolor: "#DC2626",
            },
          }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}