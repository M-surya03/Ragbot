import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation/loginSchema";
import { loginUser } from "../api/authService";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

const onSubmit = async (data) => {
  try {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: res.data.name || data.email.split("@")[0],
        email: res.data.email || data.email,
      })
    );

    navigate(from, { replace: true });
  } catch {
    alert("Invalid credentials");
  }
};


  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        borderRadius: 4,
        background: "rgba(17, 24, 39, 0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
        animation: "fadeIn 0.6s ease",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(15px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box textAlign="center" mb={3}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Portal Login
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={1}>
          Sign in to access the academic assistant
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email Address"
          fullWidth
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{
            "& input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px transparent inset",
              WebkitTextFillColor: "#fff",
              transition: "background-color 5000s ease-in-out 0s",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          sx={{
            "& input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px transparent inset",
              WebkitTextFillColor: "#fff",
              transition: "background-color 5000s ease-in-out 0s",
            },
          }}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{
            mt: 3,
            py: 1.4,
            fontSize: "0.95rem",
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            boxShadow: "0 8px 22px rgba(99,102,241,0.35)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 10px 28px rgba(139,92,246,0.45)",
            },
          }}
        >
          Sign In
        </Button>
      </form>
    </Paper>
  );
}
