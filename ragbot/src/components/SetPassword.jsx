import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { setPassword } from "../api/authService";

export default function SetPassword() {
  const [password, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getEmailFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch {
      return null;
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const email = getEmailFromToken();
    if (!email) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      await setPassword({ email, password });

      window.location.href = "/chat";
    } catch {
      setError("Failed to set password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 5,
        maxWidth: 420,
        mx: "auto",
        mt: 12,
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <LockOutlined sx={{ fontSize: 40, mb: 1 }} color="primary" />

      <Typography variant="h5" fontWeight={600} gutterBottom>
        Set Your Password
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Create a secure password to complete your account setup.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="New Password"
        type={show ? "text" : "password"}
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPwd(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShow(!show)}>
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Typography variant="caption" color="text.secondary">
        Minimum 6 characters required
      </Typography>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3, py: 1.4, fontWeight: 600 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : "Save Password"}
      </Button>
    </Paper>
  );
}
